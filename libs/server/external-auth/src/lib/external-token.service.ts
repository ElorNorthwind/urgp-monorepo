import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Observable, from, map } from 'rxjs';
import { EDO_HTTP_OPTIONS } from '../config/request-config';
import { v4 as uuidv4 } from 'uuid';
import puppeteer from 'puppeteer';
import {
  EdoCredentials,
  EdoToken,
  ExternalCredentials,
  ExternalToken,
  RsmCredentials,
  RsmToken,
  externalCredentials,
} from '@urgp/server/entities';
@Injectable()
export class ExternalTokenService {
  constructor(private readonly httpService: HttpService) {}

  public getExternalToken(dto: ExternalCredentials): Observable<ExternalToken> {
    const credentials = externalCredentials.parse(dto);
    switch (credentials.system) {
      case 'EDO':
        return this.getEdoToken(credentials);
      case 'RSM':
        return from(this.getRsmToken(credentials));
      default:
        throw new HttpException(
          'Unknown external system',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  private getEdoToken(credentials: EdoCredentials): Observable<EdoToken> {
    const re = /auth_token=(.*?);/i;
    const dnsid = uuidv4(); // who would have guessed?

    return from(
      this.httpService
        .post(
          '/auth.php',
          {
            user_id: credentials.login,
            password: credentials.password,
            DNSID: dnsid,
            groupid: credentials.groupId,
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

  private async getRsmToken(credentials: RsmCredentials): Promise<RsmToken> {
    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();
    const ip = `http://10.15.179.52:5222`;
    const url = `http://webrsm.mlc.gov:5222`;

    // change redirects to IP not DNS
    page.on('request', (req) => {
      // only for adresses that include hostname and are not on sudir page directly
      if (!req.url().includes(url) || req.url().includes('sudir.mos.ru'))
        return;

      // Replace hostname to IP in redirect adress
      page.goto(req.url().replace(url, ip));
    });

    try {
      await Promise.all([
        page.waitForNavigation(),
        page.goto(ip, { waitUntil: 'networkidle0' }), // I know, I know, it's slow. But it doesn't seem to work otherwise... :(
      ]);

      await page.type('#login', credentials.login);
      await page.type('#password', credentials.password);

      await Promise.all([page.waitForNavigation(), page.click('#bind')]);

      const cookies = await page.cookies();
      const rsmCookie = cookies.find((cookie) => {
        return cookie.name === 'Rsm.Cookie';
      })?.value;

      if (!rsmCookie) {
        Logger.error('Rsm.Cookie headder not found!');
        throw new HttpException(
          "Couldn't get RsmCookie",
          HttpStatus.UNAUTHORIZED,
        );
      }

      return { rsmCookie };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        "Couldn't get RsmCookie",
        HttpStatus.UNAUTHORIZED,
      );
    } finally {
      browser.close();
    }
  }
}
