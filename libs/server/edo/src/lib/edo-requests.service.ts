import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { SudirService } from 'libs/server/sudir/src/lib/sudir.service';
import { catchError, map, Observable } from 'rxjs';

@Injectable()
export class EdoRequestsService {
  private readonly logger = new Logger(EdoRequestsService.name);
  constructor(
    private readonly axios: HttpService,
    private readonly sudir: SudirService,
  ) {}

  public async getDocumentHtml(
    id: number,
    user?: number,
  ): Promise<Observable<string>> {
    const authData = user
      ? await this.sudir.loginUserEdo(user)
      : await this.sudir.loginMasterEdo();

    // Параметры запроса на подсказку адреса
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: '/document.card.php',
      headers: {
        cookie: `auth_token_s_${authData.DNSID}=${authData.authCode};`,
      },
      params: {
        id,
        DNSID: authData.DNSID,
      },
    };

    return this.axios.request<string>(requestConfig).pipe(
      catchError((error) => {
        throw new HttpException(
          error?.response?.data || 'Failed to load document',
          error.response.status || HttpStatus.SERVICE_UNAVAILABLE,
        );
      }),
      map((res) => res.data),
    );
  }
}
