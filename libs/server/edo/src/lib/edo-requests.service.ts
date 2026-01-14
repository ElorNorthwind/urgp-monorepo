import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { catchError, map, Observable, retry } from 'rxjs';
import { EdoAxiosRequestConfig } from '../model/types';

@Injectable()
export class EdoRequestsService {
  private readonly logger = new Logger(EdoRequestsService.name);
  constructor(private readonly axios: HttpService) {}

  private request(config: EdoAxiosRequestConfig): Observable<string> {
    return this.axios.request(config).pipe(
      retry(1),
      catchError((error) => {
        throw new HttpException(
          error?.response?.data || 'Failed to load document',
          error.response.status || HttpStatus.SERVICE_UNAVAILABLE,
        );
      }),
      map((res) => res.data),
    );
  }

  public async getDocumentHtml(
    id: number,
    edoUserId?: number,
  ): Promise<Observable<string>> {
    const requestConfig: EdoAxiosRequestConfig = {
      edoUserId: edoUserId || null,
      method: 'get',
      url: '/document.card.php',
      params: {
        id,
      },
    };
    return this.request(requestConfig);
  }
}
