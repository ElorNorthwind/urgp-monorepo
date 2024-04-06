import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { parse } from 'node-html-parser';
import { EdoSessionService } from './session.service';
import {
  EdoAuthTokenRequest,
  EdoSession,
  EdoSessonLoginRequest,
  EdoSessonLookupRequest,
} from './types';
import { getTokenRequestOptions } from './lib/get-token-request-options';
import { ClsService } from 'nestjs-cls';
import { catchError, firstValueFrom, map, retry } from 'rxjs';

@Injectable()
export class EdoAuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly sessionService: EdoSessionService,
    private readonly cls: ClsService,
  ) {}

  private async getDnsid(): Promise<string> {
    return firstValueFrom(
      this.httpService.get('/auth.php').pipe(
        catchError((error) => {
          throw new HttpException(
            error?.response?.data || 'Failed to load EDO',
            error.response.status || HttpStatus.UNAUTHORIZED,
          );
        }),
        map((res) => {
          const dnsid = parse(res.data)
            .querySelector("input[name='DNSID']")
            ?.getAttribute('value');
          if (!dnsid)
            throw new HttpException(
              "Couldn't get DNISD",
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          return dnsid;
        }),
        retry(2),
      ),
    );
  }

  // Надо бы разобраться с обзёрваблами и переделать под них
  private async getAuthToken(authData: EdoAuthTokenRequest): Promise<string> {
    const re = /auth_token=(.*?);/i;

    return firstValueFrom(
      this.httpService.post(...getTokenRequestOptions(authData)).pipe(
        catchError((error) => {
          console.log(error);
          throw new HttpException(
            error?.response?.data || 'Failed to load EDO',
            error.response.status || HttpStatus.UNAUTHORIZED,
          );
        }),
        map((res) => {
          const authToken = res?.headers['set-cookie']?.[1]?.match(re)?.[1];
          if (!authToken) {
            throw new HttpException(
              "Couldn't get AuthToken",
              HttpStatus.UNAUTHORIZED,
            );
          }
          return authToken;
        }),
        retry(2),
      ),
    );
  }

  private getServerCredentials(
    requestData: EdoSessonLookupRequest,
  ): EdoSessonLoginRequest {
    if (requestData?.userid) {
      // ИМПЛЕМЕНТИРУЙ ЗАПРОС В ОСНОВНУЮ БД! Получать данные юзера, открывшего системе свой аккаунт
      throw new HttpException(
        "Couldn't find password for EDO user " + requestData.userid,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // ИМПЛЕМЕНТИРУЙ ЗАПРОС В ОСНОВНУЮ БД! Получать дефолтного юзера управления с соответствующими фолбэками
    const userid = process.env['EDO_DEFAULT_USERID'] || '';
    const password = process.env['EDO_DEFAULT_PASSWORD'] || '';
    return { userid, password };
  }

  private async createNewSession(
    sessionArgs: EdoSessonLoginRequest,
  ): Promise<EdoSession> {
    const { userid, password } = sessionArgs;

    const dnsid = await this.getDnsid();
    const authToken = await this.getAuthToken({
      userid,
      password,
      dnsid,
    });

    if (!dnsid || !authToken) {
      throw new HttpException(
        'Failed to login to EDO',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const newSession = this.sessionService.setSession({
      userid,
      dnsid,
      authToken,
    });

    this.cls.set('edo.sessionIsNew', true);
    return newSession;
  }

  async login(requestData: EdoSessonLookupRequest): Promise<EdoSession> {
    const hasClientCredentials =
      Boolean(requestData?.userid) && Boolean(requestData?.password);

    const needsNewSession =
      hasClientCredentials || Boolean(requestData?.forceNewSession);

    if (!needsNewSession) {
      const existingSession = this.sessionService.getSession(requestData);

      if (existingSession) {
        this.cls.set('edo.sessionIsNew', false);
        return existingSession;
      }
    }

    const { userid = '', password = '' } = hasClientCredentials
      ? requestData
      : this.getServerCredentials(requestData);

    return await this.createNewSession({ userid, password });
  }
}
