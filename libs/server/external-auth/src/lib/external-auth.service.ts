import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import parse from 'node-html-parser';
import { Observable, from, map } from 'rxjs';
import { EDO_HTTP_OPTIONS } from '../config/request-config';
import { EdoCredentials } from '../model/types';

@Injectable()
export class ExternalAuthService {
  constructor(private readonly httpService: HttpService) {}

  getDnsid(): Observable<string> {
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

  getAuthToken(
    accessdata: EdoCredentials & { dnsid: string },
  ): Observable<string> {
    const re = /auth_token=(.*?);/i;

    return from(
      this.httpService
        .post(
          '/auth.php',
          {
            user_id: accessdata.userid,
            password: accessdata.password,
            DNSID: accessdata.dnsid,
            groupid: accessdata.groupid || 21,
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
}
