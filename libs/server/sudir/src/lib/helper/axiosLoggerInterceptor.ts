import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

@Injectable()
export class AxiosLoggingInterceptor {
  private readonly logger = new Logger(AxiosLoggingInterceptor.name);

  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.logger.debug(
          `Outgoing Request: ${config.method?.toUpperCase()} ${config.url}`,
        );
        this.logger.debug(`Request Headers: ${JSON.stringify(config.headers)}`);
        if (config.data) {
          this.logger.debug(`Request Body: ${JSON.stringify(config.data)}`);
        }
        return config;
      },
      (error: AxiosError) => {
        this.logger.error(`Request Error: ${error.message}`);
        return Promise.reject(error);
      },
    );

    this.httpService.axiosRef.interceptors.response.use(
      (response: AxiosResponse) => {
        this.logger.debug(
          `Incoming Response for ${response.config.method?.toUpperCase()} ${response.config.url}`,
        );
        this.logger.debug(
          `Response Status: ${response.status} ${response.statusText}`,
        );
        this.logger.debug(`Response Data: ${JSON.stringify(response.data)}`);
        return response;
      },
      (error: AxiosError) => {
        this.logger.error(
          `Response Error for ${error.config?.method?.toUpperCase()} ${error.config?.url}: ${error.message}`,
        );
        if (error.response) {
          this.logger.error(`Error Response Status: ${error.response.status}`);
          this.logger.error(
            `Error Response Data: ${JSON.stringify(error.response.data)}`,
          );
        }
        return Promise.reject(error);
      },
    );
  }
}
