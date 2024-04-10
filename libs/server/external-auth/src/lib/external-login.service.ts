import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import parse from 'node-html-parser';
import { Observable, firstValueFrom, from, map, mergeMap } from 'rxjs';
import { EDO_HTTP_OPTIONS } from '../config/request-config';
import { EdoCredentials } from '../model/types';
import { EdoTokenData } from '@urgp/server/sessions';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ExternalLoginService {
  constructor(private readonly httpService: HttpService) {}

  getEdoToken(credentials: EdoCredentials): Observable<EdoTokenData> {
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
