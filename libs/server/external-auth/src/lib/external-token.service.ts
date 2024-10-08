import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Observable, from, map } from 'rxjs';
import { EDO_HTTP_OPTIONS } from '../config/request-config';
import puppeteer from 'puppeteer';
import {
  EdoToken,
  ExternalCredentials,
  ExternalCredentialsWithSystem,
  ExternalToken,
  RsmToken,
  externalCredentialsWithSystem,
} from '@urgp/server/entities';

@Injectable()
export class ExternalTokenService {
  constructor(private readonly httpService: HttpService) {}

  public getExternalToken(
    dto: ExternalCredentialsWithSystem,
  ): Observable<ExternalToken> {
    const credentials = externalCredentialsWithSystem.parse(dto);
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

  private getEdoToken(credentials: ExternalCredentials): Observable<EdoToken> {
    const re = /auth_token=(.*?);/i;
    const dnsid = this.fakeDnsid();

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

  private fakeDnsid(keyLength = 23): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const variantLength = alphabet.length;
    let result = '';
    for (let i = 0; i < keyLength; i++) {
      result += alphabet[Math.floor(Math.random() * variantLength)];
    }
    return result;
  }

  private async getRsmToken(
    credentials: ExternalCredentials,
  ): Promise<RsmToken> {
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
