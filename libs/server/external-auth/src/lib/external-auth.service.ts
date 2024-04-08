import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import parse from 'node-html-parser';
import { Observable, firstValueFrom, from, map, mergeMap } from 'rxjs';
import { EDO_HTTP_OPTIONS } from '../config/request-config';
import { EdoCredentials } from '../model/types';
import { EdoAccessData } from '@urgp/server/sessions';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ExternalAuthService {
  constructor(private readonly httpService: HttpService) {}

  private getDnsid(): Observable<string> {
    return from(
      this.httpService.get('/auth.php', EDO_HTTP_OPTIONS).pipe(
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
      ),
    );
  }

  private _getAuthToken(
    credentials: EdoCredentials & { dnsid: string },
  ): Observable<string> {
    const re = /auth_token=(.*?);/i;

    return from(
      this.httpService
        .post(
          '/auth.php',
          {
            user_id: credentials.userid,
            password: credentials.password,
            DNSID: credentials.dnsid,
            groupid: credentials.groupid || 21,
          },
          {
            ...EDO_HTTP_OPTIONS,
            maxRedirects: 0,
            validateStatus: (status: number) => status === 302,
          },
        )
        .pipe(
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
        ),
    );
  }

  private _getEdoAccessData(
    credentials: EdoCredentials,
  ): Observable<EdoAccessData> {
    const $dnsid = this.getDnsid();
    return $dnsid.pipe(
      mergeMap(async (dnsid) => {
        return {
          dnsid,
          authToken: await firstValueFrom(
            this._getAuthToken({ ...credentials, dnsid }),
          ),
        };
      }),
    );
  }

  getEdoAccessData(credentials: EdoCredentials): Observable<EdoAccessData> {
    const re = /auth_token=(.*?);/i;
    const dnsid = uuidv4();

    return from(
      this.httpService
        .post(
          '/auth.php',
          {
            user_id: credentials.userid,
            password: credentials.password,
            DNSID: dnsid,
            groupid: credentials.groupid || 21,
          },
          {
            ...EDO_HTTP_OPTIONS,
            maxRedirects: 0,
            validateStatus: (status: number) => status === 302,
          },
        )
        .pipe(
          map((res) => {
            const authToken = res?.headers['set-cookie']?.[1]?.match(re)?.[1];
            if (!authToken) {
              throw new HttpException(
                "Couldn't get AuthToken",
                HttpStatus.UNAUTHORIZED,
              );
            }
            return { dnsid, authToken };
          }),
        ),
    );
  }
}
