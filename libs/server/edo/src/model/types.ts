import { AxiosRequestConfig } from 'axios';

export interface EdoAxiosRequestConfig extends AxiosRequestConfig {
  edoUserId?: number | null;
}
