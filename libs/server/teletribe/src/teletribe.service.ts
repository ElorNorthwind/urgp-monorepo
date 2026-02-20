import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { EmailService } from '@urgp/server/email';
import { format, subDays } from 'date-fns';
import Imap, { MailBoxes } from 'imap';
import { DgiAnalyticsService } from 'libs/server/dgi-analytics/src/dgi-analytics.service';
import PostalMime from 'postal-mime';
import { firstValueFrom, map } from 'rxjs';
import { HOTLINE_REPORT_DATA } from './config/constants';
import { AxiosResponse } from 'axios';

@Injectable()
export class TeletribeService {
  private readonly logger = new Logger(TeletribeService.name);
  private tokens: Map<string, string> = new Map();
  // private sessionCookie: string | null = null;
  // private authCookieHome: string | null = null;
  private fa2RequestDate: Date | null = null;

  constructor(
    private configService: ConfigService,
    private readonly dbServise: DatabaseService,
    private readonly dgiAnalytics: DgiAnalyticsService,
    private readonly axios: HttpService,
    private readonly email: EmailService,
  ) {}

  private getAuthCookies(): string | null {
    const tokenArray = Array.from(this.tokens.entries()).map(
      ([key, value]) => `${key}=${value}`,
    );
    if (tokenArray.length === 0) return null;
    return tokenArray.join('; ');
  }
  private setTokenFromResponse(response: AxiosResponse<any, any, {}>): void {
    if (!response?.headers?.['set-cookie']) {
      return;
    }
    const cookies = response?.headers?.['set-cookie']
      .join('; ')
      .split('; ')
      .filter((cookie) => !cookie.includes('path=/'));

    cookies.forEach((cookie) => {
      const [key, value] = cookie.split('=');
      this.tokens.set(key, value);
    });
    return;
  }

  private resetAuthCookies() {
    this.tokens.clear();
  }
  public async testAuth(): Promise<any> {
    const login = this.configService.get<string>('TELETRIBE_LOGIN');
    const password = this.configService.get<string>('TELETRIBE_PASSWORD');

    if (!login || !password) {
      throw new Error('Teletribe credentials are missing');
    }

    this.resetAuthCookies();

    // Логин пользователя и получение сессии
    const firstAuthData = await firstValueFrom(
      this.axios
        .request({
          url: '/auth.php',
          method: 'POST',
          data: {
            'data[login]': login,
            'data[password]': password,
          },
          headers: {
            Cookie: this.getAuthCookies(),
          },
        })
        .pipe(
          map((response) => {
            this.setTokenFromResponse(response);
            return response?.data;
          }),
        ),
    );

    // Запрос кода на почту
    const fa2 = await firstValueFrom(
      this.axios
        .request({
          url: `/auth-2fa.php?${this.tokens.get('varwwwhtmlrsbackendconfig')}&alter=false`,
          method: 'GET',
          headers: {
            cookie: this.getAuthCookies(),
          },
        })
        .pipe(
          map((response) => {
            if (response.status !== 200) {
              new Error(
                `Failed to request 2fa code, status code: ${response.status}`,
              );
            }
            return response?.data;
          }),
        ),
    );

    const code = await this.get2faCode();

    await firstValueFrom(
      this.axios
        .request({
          url: `/auth-2fa.php`,
          method: 'POST',
          headers: {
            cookie: this.getAuthCookies(),
          },
          data: {
            key: code,
          },
        })
        .pipe(
          map((response) => {
            if (response.status !== 200) {
              new Error(
                `Failed to post 2fa code, status code: ${response.status}`,
              );
            }
            this.fa2RequestDate = new Date();
          }),
        ),
    );

    await this.setAccessToken('reports-show');
    return this.getDetailedReport();
  }

  private async get2faCode(): Promise<number> {
    const maxRetries = 15;
    const interval = 29000;
    let retries = 0;
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';

    while (retries < maxRetries) {
      await new Promise((resolve) =>
        setTimeout(resolve, retries === 0 ? 15000 : interval + retries * 1000),
      );
      isDev &&
        this.logger.log(
          `Trying to get 2fa code by email... Atempt: ${retries + 1}`,
        );

      const code = await this.email.getTeletribeCode();
      if (code) {
        return code;
      }
      retries++;
    }
    throw new Error('Failed to get 2fa code by email');
  }

  private async setAccessToken(to: string): Promise<Map<string, string>> {
    await firstValueFrom(
      this.axios
        .request({
          url: '/access.php',
          method: 'POST',
          headers: { cookie: this.getAuthCookies() },
          data: {
            to,
          },
        })
        .pipe(map((response) => this.setTokenFromResponse(response))),
    );
    return this.tokens;
  }

  async getDetailedReport(q?: {
    dateFrom: string | undefined;
    dateTo: string | undefined;
    page: number | undefined;
  }): Promise<any> {
    const dateFrom =
      q?.dateFrom ?? format(subDays(new Date(), 1), 'dd.MM.yyyy');
    const dateTo = q?.dateTo ?? format(new Date(), 'dd.MM.yyyy');
    const page = q?.page ?? 1;
    const token = this.tokens.get('varwwwhtmlrsbackendconfig');
    if (!token) throw new Error('Failed to get teletribe session token');

    // to reports-show
    // accessToken[reports-show]=41e7637e7b6a9f27a98b84d3a185c7c0; path=/

    // Запрос кода на почту
    const reportData = await firstValueFrom(
      this.axios
        .request({
          url: `/handler.php`,
          method: 'POST',
          headers: {
            cookie: this.getAuthCookies(),
          },
          data: {
            ...HOTLINE_REPORT_DATA,
            'data[requestId]': Date.now(),
            'data[variables][0][value]': dateFrom,
            'data[variables][1][value]': dateTo,
            'data[page]': page,
            token,
          },
        })
        .pipe(
          map((response) => {
            return response?.data;
          }),
        ),
    );
    return reportData;
  }

  // curl 'https://reports.teletribe.ru/rs/backend/handler.php' \
  //   -H 'Accept: application/json, text/plain, */*' \
  //   -H 'Accept-Language: ru-RU,ru;q=0.9' \
  //   -H 'Connection: keep-alive' \
  //   -H 'Content-Type: application/x-www-form-urlencoded' \
  //   -b 'varwwwhtmlrsbackendconfig=7knjgar2v1c3j48b8sivlkpmpt; accessToken[home]=1f5e7f2748adabf08629a6312ac3bfdd; accessToken[reports-enumeration]=b23975176653284f1f7356ba5539cfcb; accessToken[reports-show]=c3810d4a9513b028fc0f2a83cb6d7b50' \
  //   -H 'Origin: https://reports.teletribe.ru' \
  //   -H 'Referer: https://reports.teletribe.ru/rs/' \
  //   -H 'Sec-Fetch-Dest: empty' \
  //   -H 'Sec-Fetch-Mode: cors' \
  //   -H 'Sec-Fetch-Site: same-origin' \
  //   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
  //   -H 'X-Requested-With: XMLHttpRequest' \
  //   -H 'sec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"' \
  //   -H 'sec-ch-ua-mobile: ?0' \
  //   -H 'sec-ch-ua-platform: "macOS"' \
  //   --data-raw 'data%5Bid%5D=1539&data%5Bdb_alias%5D=STAT&data%5BidReport%5D=&data%5BrequestId%5D=1771531962005&data%5Bvariables%5D%5B0%5D%5BvarName%5D=ipcursor_begin&data%5Bvariables%5D%5B0%5D%5Blabel%5D=%D0%9D%D0%B0%D1%87%D0%B0%D0%BB%D0%BE+%D0%BF%D0%B5%D1%80%D0%B8%D0%BE%D0%B4%D0%B0&data%5Bvariables%5D%5B0%5D%5Bid%5D=3&data%5Bvariables%5D%5B0%5D%5Bvalue%5D=18.02.2026&data%5Bvariables%5D%5B0%5D%5Boptions%5D=&data%5Bvariables%5D%5B0%5D%5Brequired%5D=1&data%5Bvariables%5D%5B0%5D%5Bconditions%5D=&data%5Bvariables%5D%5B1%5D%5BvarName%5D=ipcursor_end&data%5Bvariables%5D%5B1%5D%5Blabel%5D=%D0%9A%D0%BE%D0%BD%D0%B5%D1%86+%D0%BF%D0%B5%D1%80%D0%B8%D0%BE%D0%B4%D0%B0&data%5Bvariables%5D%5B1%5D%5Bid%5D=3&data%5Bvariables%5D%5B1%5D%5Bvalue%5D=19.02.2026&data%5Bvariables%5D%5B1%5D%5Boptions%5D=&data%5Bvariables%5D%5B1%5D%5Brequired%5D=1&data%5Bvariables%5D%5B1%5D%5Bconditions%5D=&data%5BsortBy%5D=&data%5BprojectId%5D=corebo00000000000odiudnsgl1fukug&data%5Bcolumns%5D%5B0%5D%5BID%5D=238058&data%5Bcolumns%5D%5B0%5D%5BENG_NAME%5D=SESSION_ID&data%5Bcolumns%5D%5B0%5D%5BRUS_NAME%5D=ID+%D0%B7%D0%B2%D0%BE%D0%BD%D0%BA%D0%B0&data%5Bcolumns%5D%5B0%5D%5BSORT_ORDER%5D=10&data%5Bcolumns%5D%5B0%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B0%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B0%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B1%5D%5BID%5D=238059&data%5Bcolumns%5D%5B1%5D%5BENG_NAME%5D=ABONENT&data%5Bcolumns%5D%5B1%5D%5BRUS_NAME%5D=%D0%90%D0%9E%D0%9D&data%5Bcolumns%5D%5B1%5D%5BSORT_ORDER%5D=20&data%5Bcolumns%5D%5B1%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B1%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B1%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B2%5D%5BID%5D=238060&data%5Bcolumns%5D%5B2%5D%5BENG_NAME%5D=DST&data%5Bcolumns%5D%5B2%5D%5BRUS_NAME%5D=%D0%9D%D0%BE%D0%BC%D0%B5%D1%80+%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0&data%5Bcolumns%5D%5B2%5D%5BSORT_ORDER%5D=30&data%5Bcolumns%5D%5B2%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B2%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B2%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B3%5D%5BID%5D=238061&data%5Bcolumns%5D%5B3%5D%5BENG_NAME%5D=CALL_DATE&data%5Bcolumns%5D%5B3%5D%5BRUS_NAME%5D=%D0%94%D0%B0%D1%82%D0%B0+%D0%BF%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F+%D0%B7%D0%B2%D0%BE%D0%BD%D0%BA%D0%B0+%D0%B2+%D0%9A%D0%A6&data%5Bcolumns%5D%5B3%5D%5BSORT_ORDER%5D=40&data%5Bcolumns%5D%5B3%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B3%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B3%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B4%5D%5BID%5D=238062&data%5Bcolumns%5D%5B4%5D%5BENG_NAME%5D=CALL_TIME&data%5Bcolumns%5D%5B4%5D%5BRUS_NAME%5D=%D0%92%D1%80%D0%B5%D0%BC%D1%8F+%D0%BF%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F+%D0%B7%D0%B2%D0%BE%D0%BD%D0%BA%D0%B0+%D0%B2+%D0%9A%D0%A6&data%5Bcolumns%5D%5B4%5D%5BSORT_ORDER%5D=50&data%5Bcolumns%5D%5B4%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B4%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B4%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B5%5D%5BID%5D=238063&data%5Bcolumns%5D%5B5%5D%5BENG_NAME%5D=SPEAKINGTIME_OP&data%5Bcolumns%5D%5B5%5D%5BRUS_NAME%5D=%D0%94%D0%BB%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C+%D1%80%D0%B0%D0%B7%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%D0%B0%2C+%D1%81%D0%B5%D0%BA&data%5Bcolumns%5D%5B5%5D%5BSORT_ORDER%5D=60&data%5Bcolumns%5D%5B5%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B5%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B5%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B6%5D%5BID%5D=238064&data%5Bcolumns%5D%5B6%5D%5BENG_NAME%5D=WAITTIME&data%5Bcolumns%5D%5B6%5D%5BRUS_NAME%5D=%D0%94%D0%BB%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C+%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F+%D0%B2+%D0%BE%D1%87%D0%B5%D1%80%D0%B5%D0%B4%D0%B8%2C+%D1%81%D0%B5%D0%BA&data%5Bcolumns%5D%5B6%5D%5BSORT_ORDER%5D=70&data%5Bcolumns%5D%5B6%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B6%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B6%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B7%5D%5BID%5D=238065&data%5Bcolumns%5D%5B7%5D%5BENG_NAME%5D=CNT_HOLD_ALL&data%5Bcolumns%5D%5B7%5D%5BRUS_NAME%5D=%D0%9A%D0%BE%D0%BB-%D0%B2%D0%BE+%D0%BF%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BE%D0%BA+%D0%BD%D0%B0+HOLD&data%5Bcolumns%5D%5B7%5D%5BSORT_ORDER%5D=80&data%5Bcolumns%5D%5B7%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B7%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B7%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B8%5D%5BID%5D=238066&data%5Bcolumns%5D%5B8%5D%5BENG_NAME%5D=HOLD_TIME&data%5Bcolumns%5D%5B8%5D%5BRUS_NAME%5D=%D0%9E%D0%B1%D1%89%D0%B5%D0%B5+%D0%B2%D1%80%D0%B5%D0%BC%D1%8F+HOLD%2C+%D1%81%D0%B5%D0%BA&data%5Bcolumns%5D%5B8%5D%5BSORT_ORDER%5D=90&data%5Bcolumns%5D%5B8%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B8%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B8%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B9%5D%5BID%5D=238067&data%5Bcolumns%5D%5B9%5D%5BENG_NAME%5D=OP_LOGIN&data%5Bcolumns%5D%5B9%5D%5BRUS_NAME%5D=%D0%9B%D0%BE%D0%B3%D0%B8%D0%BD+%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0&data%5Bcolumns%5D%5B9%5D%5BSORT_ORDER%5D=100&data%5Bcolumns%5D%5B9%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B9%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B9%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B10%5D%5BID%5D=238068&data%5Bcolumns%5D%5B10%5D%5BENG_NAME%5D=FIO_OP&data%5Bcolumns%5D%5B10%5D%5BRUS_NAME%5D=%D0%A4%D0%98%D0%9E+%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0&data%5Bcolumns%5D%5B10%5D%5BSORT_ORDER%5D=110&data%5Bcolumns%5D%5B10%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B10%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B10%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B11%5D%5BID%5D=238069&data%5Bcolumns%5D%5B11%5D%5BENG_NAME%5D=FIO&data%5Bcolumns%5D%5B11%5D%5BRUS_NAME%5D=%D0%98%D0%BC%D1%8F&data%5Bcolumns%5D%5B11%5D%5BSORT_ORDER%5D=120&data%5Bcolumns%5D%5B11%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B11%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B11%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B12%5D%5BID%5D=238070&data%5Bcolumns%5D%5B12%5D%5BENG_NAME%5D=TEMA_VOPROSA&data%5Bcolumns%5D%5B12%5D%5BRUS_NAME%5D=%D0%A2%D0%B5%D0%BC%D0%B0+%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D0%B0&data%5Bcolumns%5D%5B12%5D%5BSORT_ORDER%5D=130&data%5Bcolumns%5D%5B12%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B12%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B12%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B13%5D%5BID%5D=238071&data%5Bcolumns%5D%5B13%5D%5BENG_NAME%5D=CLIENT_SKR&data%5Bcolumns%5D%5B13%5D%5BRUS_NAME%5D=%D0%9A%D0%BB%D0%B8%D0%B5%D0%BD%D1%82&data%5Bcolumns%5D%5B13%5D%5BSORT_ORDER%5D=140&data%5Bcolumns%5D%5B13%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B13%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B13%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B14%5D%5BID%5D=238072&data%5Bcolumns%5D%5B14%5D%5BENG_NAME%5D=REG&data%5Bcolumns%5D%5B14%5D%5BRUS_NAME%5D=%D0%90%D0%B4%D1%80%D0%B5%D1%81+%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8+%D0%BF%D0%BE+%D0%BC%2F%D0%B6&data%5Bcolumns%5D%5B14%5D%5BSORT_ORDER%5D=150&data%5Bcolumns%5D%5B14%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B14%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B14%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B15%5D%5BID%5D=238073&data%5Bcolumns%5D%5B15%5D%5BENG_NAME%5D=MSC&data%5Bcolumns%5D%5B15%5D%5BRUS_NAME%5D=%D0%9E%D1%82%D0%BD%D0%BE%D1%88%D0%B5%D0%BD%D0%B8%D1%8F+%D1%81+%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%BE%D0%B9+(%E2%84%96+%D1%83%D1%87%D0%B5%D1%82%D0%BD%D0%BE%D0%B3%D0%BE+%D0%B4%D0%B5%D0%BB%D0%B0%2F%D0%B4%D0%BE%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%D0%B0&data%5Bcolumns%5D%5B15%5D%5BSORT_ORDER%5D=160&data%5Bcolumns%5D%5B15%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B15%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B15%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B16%5D%5BID%5D=238074&data%5Bcolumns%5D%5B16%5D%5BENG_NAME%5D=QUEST&data%5Bcolumns%5D%5B16%5D%5BRUS_NAME%5D=%D0%9F%D0%BE+%D1%81%D0%BE%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D0%BD%D0%B8%D1%8E+%D0%BA%D0%B0%D0%BA%D0%BE%D0%B3%D0%BE+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0+%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81&data%5Bcolumns%5D%5B16%5D%5BSORT_ORDER%5D=170&data%5Bcolumns%5D%5B16%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B16%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B16%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B17%5D%5BID%5D=238075&data%5Bcolumns%5D%5B17%5D%5BENG_NAME%5D=DATE_DOC&data%5Bcolumns%5D%5B17%5D%5BRUS_NAME%5D=%D0%94%D0%B0%D1%82%D0%B0+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0&data%5Bcolumns%5D%5B17%5D%5BSORT_ORDER%5D=180&data%5Bcolumns%5D%5B17%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B17%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B17%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B18%5D%5BID%5D=238076&data%5Bcolumns%5D%5B18%5D%5BENG_NAME%5D=NUM_DOC&data%5Bcolumns%5D%5B18%5D%5BRUS_NAME%5D=%D0%9D%D0%BE%D0%BC%D0%B5%D1%80+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0&data%5Bcolumns%5D%5B18%5D%5BSORT_ORDER%5D=190&data%5Bcolumns%5D%5B18%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B18%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B18%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B19%5D%5BID%5D=238077&data%5Bcolumns%5D%5B19%5D%5BENG_NAME%5D=UPR&data%5Bcolumns%5D%5B19%5D%5BRUS_NAME%5D=%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5&data%5Bcolumns%5D%5B19%5D%5BSORT_ORDER%5D=200&data%5Bcolumns%5D%5B19%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B19%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B19%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B20%5D%5BID%5D=238078&data%5Bcolumns%5D%5B20%5D%5BENG_NAME%5D=Q_111&data%5Bcolumns%5D%5B20%5D%5BRUS_NAME%5D=%D0%9E%D1%82%D0%BA%D1%83%D0%B4%D0%B0+%D1%83%D0%B7%D0%BD%D0%B0%D0%BB%D0%B8+%D0%BE+%D0%93%D0%BE%D1%80%D1%8F%D1%87%D0%B5%D0%B9+%D0%9B%D0%B8%D0%BD%D0%B8%D0%B8+%D0%94%D0%93%D0%98&data%5Bcolumns%5D%5B20%5D%5BSORT_ORDER%5D=210&data%5Bcolumns%5D%5B20%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B20%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B20%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B21%5D%5BID%5D=238079&data%5Bcolumns%5D%5B21%5D%5BENG_NAME%5D=OP_VOP&data%5Bcolumns%5D%5B21%5D%5BRUS_NAME%5D=%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5+%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D0%B0&data%5Bcolumns%5D%5B21%5D%5BSORT_ORDER%5D=220&data%5Bcolumns%5D%5B21%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B21%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B21%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B22%5D%5BID%5D=238080&data%5Bcolumns%5D%5B22%5D%5BENG_NAME%5D=HAR_VOP&data%5Bcolumns%5D%5B22%5D%5BRUS_NAME%5D=%D0%A5%D0%B0%D1%80%D0%B0%D0%BA%D1%82%D0%B5%D1%80+%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D0%B0&data%5Bcolumns%5D%5B22%5D%5BSORT_ORDER%5D=230&data%5Bcolumns%5D%5B22%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B22%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B22%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B23%5D%5BID%5D=238081&data%5Bcolumns%5D%5B23%5D%5BENG_NAME%5D=PER_DAN&data%5Bcolumns%5D%5B23%5D%5BRUS_NAME%5D=%D0%92%D0%BE%D0%BF%D1%80%D0%BE%D1%81+%D1%82%D1%80%D0%B5%D0%B1%D1%83%D0%B5%D1%82+%D1%80%D0%B0%D0%B7%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D1%8F+%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D1%85+%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%09&data%5Bcolumns%5D%5B23%5D%5BSORT_ORDER%5D=240&data%5Bcolumns%5D%5B23%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B23%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B23%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B24%5D%5BID%5D=238082&data%5Bcolumns%5D%5B24%5D%5BENG_NAME%5D=VNE_COMP&data%5Bcolumns%5D%5B24%5D%5BRUS_NAME%5D=%D0%92%D0%BE%D0%BF%D1%80%D0%BE%D1%81+%D0%BD%D0%B5+%D0%B2+%D0%BA%D0%BE%D0%BC%D0%BF%D0%B5%D1%82%D0%B5%D0%BD%D1%86%D0%B8%D0%B8%09&data%5Bcolumns%5D%5B24%5D%5BSORT_ORDER%5D=250&data%5Bcolumns%5D%5B24%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B24%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B24%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B25%5D%5BID%5D=238083&data%5Bcolumns%5D%5B25%5D%5BENG_NAME%5D=YANDEX&data%5Bcolumns%5D%5B25%5D%5BRUS_NAME%5D=%D0%9E%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD+%D0%BD%D0%B0+%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81&data%5Bcolumns%5D%5B25%5D%5BSORT_ORDER%5D=260&data%5Bcolumns%5D%5B25%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B25%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B25%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B26%5D%5BID%5D=238084&data%5Bcolumns%5D%5B26%5D%5BENG_NAME%5D=OBR_CALL&data%5Bcolumns%5D%5B26%5D%5BRUS_NAME%5D=%D0%9E%D0%B1%D1%80%D0%B0%D1%82%D0%BD%D1%8B%D0%B9+%D0%B7%D0%B2%D0%BE%D0%BD%D0%BE%D0%BA&data%5Bcolumns%5D%5B26%5D%5BSORT_ORDER%5D=270&data%5Bcolumns%5D%5B26%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B26%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B26%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B27%5D%5BID%5D=238085&data%5Bcolumns%5D%5B27%5D%5BENG_NAME%5D=PRICH&data%5Bcolumns%5D%5B27%5D%5BRUS_NAME%5D=%D0%9D%D0%B0%D0%BB%D0%B8%D1%87%D0%B8%D0%B5+%D0%BF%D1%80%D0%B8%D1%87%D0%B8%D0%BD+%D0%B4%D0%BB%D1%8F+%D0%B4%D0%BE%D1%81%D1%80%D0%BE%D1%87%D0%BD%D0%BE%D0%B3%D0%BE+%D0%BF%D1%80%D0%B5%D0%BA%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%B8%D1%8F+%D1%80%D0%B0%D0%B7%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%D0%B0&data%5Bcolumns%5D%5B27%5D%5BSORT_ORDER%5D=280&data%5Bcolumns%5D%5B27%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B27%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B27%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B28%5D%5BID%5D=238086&data%5Bcolumns%5D%5B28%5D%5BENG_NAME%5D=IF_DA&data%5Bcolumns%5D%5B28%5D%5BRUS_NAME%5D=%D0%95%D1%81%D0%BB%D0%B8+%D0%BE%D1%82%D0%B2%D0%B5%D1%82+%D0%B4%D0%B0&data%5Bcolumns%5D%5B28%5D%5BSORT_ORDER%5D=290&data%5Bcolumns%5D%5B28%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B28%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B28%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B29%5D%5BID%5D=238087&data%5Bcolumns%5D%5B29%5D%5BENG_NAME%5D=SVO&data%5Bcolumns%5D%5B29%5D%5BRUS_NAME%5D=%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA+%D0%A1%D0%92%D0%9E&data%5Bcolumns%5D%5B29%5D%5BSORT_ORDER%5D=300&data%5Bcolumns%5D%5B29%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B29%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B29%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B30%5D%5BID%5D=238088&data%5Bcolumns%5D%5B30%5D%5BENG_NAME%5D=FAMILY_SVO&data%5Bcolumns%5D%5B30%5D%5BRUS_NAME%5D=%D0%A7%D0%BB%D0%B5%D0%BD+%D1%81%D0%B5%D0%BC%D1%8C%D0%B8+%D1%83%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA%D0%B0+%D0%A1%D0%92%D0%9E&data%5Bcolumns%5D%5B30%5D%5BSORT_ORDER%5D=310&data%5Bcolumns%5D%5B30%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B30%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B30%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B31%5D%5BID%5D=238089&data%5Bcolumns%5D%5B31%5D%5BENG_NAME%5D=FLG_CALL_DISCONNECTION&data%5Bcolumns%5D%5B31%5D%5BRUS_NAME%5D=%D0%98%D0%BD%D0%B8%D1%86%D0%B8%D0%B0%D1%82%D0%BE%D1%80+%D1%80%D0%B0%D0%B7%D1%80%D1%8B%D0%B2%D0%B0+%D0%B7%D0%B2%D0%BE%D0%BD%D0%BA%D0%B0&data%5Bcolumns%5D%5B31%5D%5BSORT_ORDER%5D=320&data%5Bcolumns%5D%5B31%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B31%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B31%5D%5Bshow%5D=1&data%5Bcolumns%5D%5B32%5D%5BID%5D=238090&data%5Bcolumns%5D%5B32%5D%5BENG_NAME%5D=SOUND&data%5Bcolumns%5D%5B32%5D%5BRUS_NAME%5D=%D0%9F%D1%80%D0%BE%D1%81%D0%BB%D1%83%D1%88%D0%B0%D1%82%D1%8C&data%5Bcolumns%5D%5B32%5D%5BSORT_ORDER%5D=330&data%5Bcolumns%5D%5B32%5D%5BEXCEL_TYPE%5D=string&data%5Bcolumns%5D%5B32%5D%5BBROWSER_WIDTH%5D=&data%5Bcolumns%5D%5B32%5D%5Bshow%5D=1&data%5BexpiredDate%5D=&data%5Bpage%5D=1&data%5BperPage%5D=100&data%5BprojectIds%5D=&data%5BshowType%5D=&method=show&service=reports%2Freports&interface=reports-show&token=7knjgar2v1c3j48b8sivlkpmpt'

  // POST email code
  // curl 'https://reports.teletribe.ru/rs/backend/auth-2fa.php' \
  //   -H 'Accept: application/json, text/plain, */*' \
  //   -H 'Accept-Language: ru-RU,ru;q=0.9' \
  //   -H 'Connection: keep-alive' \
  //   -H 'Content-Type: application/x-www-form-urlencoded' \
  //   -b 'varwwwhtmlrsbackendconfig=7knjgar2v1c3j48b8sivlkpmpt; accessToken[home]=1f5e7f2748adabf08629a6312ac3bfdd' \
  //   -H 'Origin: https://reports.teletribe.ru' \
  //   -H 'Referer: https://reports.teletribe.ru/rs/' \
  //   -H 'Sec-Fetch-Dest: empty' \
  //   -H 'Sec-Fetch-Mode: cors' \
  //   -H 'Sec-Fetch-Site: same-origin' \
  //   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
  //   -H 'X-Requested-With: XMLHttpRequest' \
  //   -H 'sec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"' \
  //   -H 'sec-ch-ua-mobile: ?0' \
  //   -H 'sec-ch-ua-platform: "macOS"' \
  //   --data-raw 'key=0985'

  // public async testAuth(): Promise<any> {
  //   const login = this.configService.get<string>('TELETRIBE_LOGIN');
  //   const password = this.configService.get<string>('TELETRIBE_PASSWORD');

  //   if (!login || !password) {
  //     throw new Error('Teletribe credentials are missing');
  //   }

  //   this.resetAuthCookies();

  //   const firstAuthData = await firstValueFrom(
  //     this.axios
  //       .request({
  //         url: '/auth.php',
  //         method: 'POST',
  //         data: {
  //           'data[login]': login,
  //           'data[password]': password,
  //         },
  //       })
  //       .pipe(map((response) => response?.data)),
  //   );

  //   const token = firstAuthData?.token;

  //   if (!token) {
  //     throw new Error('Failed to get first teletribe token');
  //   }

  //   this.sessionToken = token;

  //   const secondAuthData = await firstValueFrom(
  //     this.axios
  //       .request({
  //         url: '/access.php',
  //         method: 'POST',
  //         headers: { cookie: this.getAuthCookies() },
  //         data: {
  //           to: 'home',
  //         },
  //       })
  //       .pipe(map((response) => response?.headers?.['set-cookie']?.[0])),
  //   );

  //   const accessTokenHome = secondAuthData?.split(';')[0].split('=')[1];

  //   if (!accessTokenHome) {
  //     throw new Error('Failed to get home access teletribe token');
  //   }
  //   this.authTokenHome = accessTokenHome;

  //   this.logger.warn(`Teletribe token: ${token}`);
  //   this.logger.warn(`Teletribe acces token [home]: ${accessTokenHome}`);

  //   // // Я хуй знает зачем
  //   this.axios.request({
  //     url: '/access.php',
  //     method: 'POST',
  //     headers: {
  //       cookie:
  //         `varwwwhtmlrsbackendconfig=${token}; ` +
  //         `accessToken[home]=${accessTokenHome};`,
  //     },
  //     data: {
  //       to: 'undefined',
  //     },
  //   });

  //   // // Первый шаг запроса кода на почту?
  //   this.axios.request({
  //     url: '/access-2fa.php',
  //     method: 'POST',
  //     headers: {
  //       cookie:
  //         `varwwwhtmlrsbackendconfig=${token}; ` +
  //         `accessToken[home]=${accessTokenHome};`,
  //     },
  //     data: {
  //       token: 'varwwwhtmlrsbackendconfig',
  //     },
  //   });

  //   // Второй шаг запроса кода на почту
  //   this.axios
  //     .request({
  //       url: `/access-2fa.php?${token}&alter=false`,
  //       method: 'GET',
  //       headers: {
  //         cookie:
  //           `varwwwhtmlrsbackendconfig=${token}; ` +
  //           `accessToken[home]=${accessTokenHome};`,
  //       },
  //     })
  //     .pipe(
  //       map((response) => {
  //         if (response.status !== 200) {
  //           new Error(
  //             `Failed to request 2fa code, status code: ${response.status}`,
  //           );
  //         }
  //       }),
  //     );

  //   // // Ввод проверочного кода
  //   // this.axios.request({
  //   //   url: `/access-2fa.php`,
  //   //   method: 'POST',
  //   //   headers: {
  //   //     cookie:
  //   //       `varwwwhtmlrsbackendconfig=${token}; ` +
  //   //       `accessToken[home]=${accessTokenHome};`,
  //   //   },
  //   //   data: { key: '1892' }, // TODO: заменить на реальный код из письма
  //   // });

  //   return { token, accessTokenHome };
  // }

  // Курл на получение доступа по двойной аутентификации
  // curl 'https://reports.teletribe.ru/rs/backend/auth-2fa.php' \
  //   -H 'Accept: application/json, text/plain, */*' \
  //   -H 'Accept-Language: ru-RU,ru;q=0.9' \
  //   -H 'Connection: keep-alive' \
  //   -H 'Content-Type: application/x-www-form-urlencoded' \
  //   -b 'varwwwhtmlrsbackendconfig=ogug1rrgq46rg708mm36c6ph77; accessToken[home]=1305f6c705349316360c3ccfe7cfe847' \
  //   -H 'Origin: https://reports.teletribe.ru' \
  //   -H 'Referer: https://reports.teletribe.ru/rs/' \
  //   -H 'Sec-Fetch-Dest: empty' \
  //   -H 'Sec-Fetch-Mode: cors' \
  //   -H 'Sec-Fetch-Site: same-origin' \
  //   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
  //   -H 'X-Requested-With: XMLHttpRequest' \
  //   -H 'sec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"' \
  //   -H 'sec-ch-ua-mobile: ?0' \
  //   -H 'sec-ch-ua-platform: "macOS"' \
  //   --data-raw 'key=1892'

  // Альтернатива третьего курла?
  // curl 'https://reports.teletribe.ru/rs/backend/auth-2fa.php?ogug1rrgq46rg708mm36c6ph77&alter=false' \
  //   -H 'Accept: application/json, text/plain, */*' \
  //   -H 'Accept-Language: ru-RU,ru;q=0.9' \
  //   -H 'Connection: keep-alive' \
  //   -b 'varwwwhtmlrsbackendconfig=ogug1rrgq46rg708mm36c6ph77; accessToken[home]=b6d67a24906e8a8541291882f81d31ca' \
  //   -H 'Referer: https://reports.teletribe.ru/rs/' \
  //   -H 'Sec-Fetch-Dest: empty' \
  //   -H 'Sec-Fetch-Mode: cors' \
  //   -H 'Sec-Fetch-Site: same-origin' \
  //   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
  //   -H 'X-Requested-With: XMLHttpRequest' \
  //   -H 'sec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"' \
  //   -H 'sec-ch-ua-mobile: ?0' \
  //   -H 'sec-ch-ua-platform: "macOS"'

  // Третий КУРЛ - запрашиваем проверочный емейл
  // curl 'https://reports.teletribe.ru/rs/backend/access-2fa.php' \
  // -H 'Accept: application/json, text/plain, */*' \
  // -H 'Accept-Language: ru-RU,ru;q=0.9' \
  // -H 'Connection: keep-alive' \
  // -H 'Content-Type: application/x-www-form-urlencoded' \
  // -b 'varwwwhtmlrsbackendconfig=ogug1rrgq46rg708mm36c6ph77; accessToken[home]=b6d67a24906e8a8541291882f81d31ca' \
  // -H 'Origin: https://reports.teletribe.ru' \
  // -H 'Referer: https://reports.teletribe.ru/rs/' \
  // -H 'Sec-Fetch-Dest: empty' \
  // -H 'Sec-Fetch-Mode: cors' \
  // -H 'Sec-Fetch-Site: same-origin' \
  // -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
  // -H 'X-Requested-With: XMLHttpRequest' \
  // -H 'sec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"' \
  // -H 'sec-ch-ua-mobile: ?0' \
  // -H 'sec-ch-ua-platform: "macOS"' \
  // --data-raw 'token=varwwwhtmlrsbackendconfig'

  // Второй КУРЛ - получаем куки доступа?
  // curl 'https://reports.teletribe.ru/rs/backend/access.php' \
  //   -H 'Accept: application/json, text/plain, */*' \
  //   -H 'Accept-Language: ru-RU,ru;q=0.9' \
  //   -H 'Connection: keep-alive' \
  //   -H 'Content-Type: application/x-www-form-urlencoded' \
  //   -b 'varwwwhtmlrsbackendconfig=ogug1rrgq46rg708mm36c6ph77' \
  //   -H 'Origin: https://reports.teletribe.ru' \
  //   -H 'Referer: https://reports.teletribe.ru/rs/' \
  //   -H 'Sec-Fetch-Dest: empty' \
  //   -H 'Sec-Fetch-Mode: cors' \
  //   -H 'Sec-Fetch-Site: same-origin' \
  //   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
  //   -H 'X-Requested-With: XMLHttpRequest' \
  //   -H 'sec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"' \
  //   -H 'sec-ch-ua-mobile: ?0' \
  //   -H 'sec-ch-ua-platform: "macOS"' \
  //   --data-raw 'to=home'

  // Первый КУРЛ - получаем токен
  // curl 'https://reports.teletribe.ru/rs/backend/auth.php' \
  //   -H 'Accept: application/json, text/plain, */*' \
  //   -H 'Accept-Language: ru-RU,ru;q=0.9' \
  //   -H 'Connection: keep-alive' \
  //   -H 'Content-Type: application/x-www-form-urlencoded' \
  //   -b 'varwwwhtmlrsbackendconfig=h97r8e4f9nftjcpkkhnf2vdh9l' \
  //   -H 'Origin: https://reports.teletribe.ru' \
  //   -H 'Referer: https://reports.teletribe.ru/rs/' \
  //   -H 'Sec-Fetch-Dest: empty' \
  //   -H 'Sec-Fetch-Mode: cors' \
  //   -H 'Sec-Fetch-Site: same-origin' \
  //   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
  //   -H 'X-Requested-With: XMLHttpRequest' \
  //   -H 'sec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"' \
  //   -H 'sec-ch-ua-mobile: ?0' \
  //   -H 'sec-ch-ua-platform: "macOS"' \
  //   --data-raw 'data%5Blogin%5D=LOGIN&data%5Bpassword%5D=PWD'
}

/// FIRST TOKEN resp

// {
//     "token": "n7hgo....fb9iv4",
//     "groups": {
//         "reportsonlineop": "reportsonlineop",
//         "reportsonline": "reportsonline",
//         "sounds_all": "sounds_all",
//         "reports_read": "reports_read",
//         "reports_proj_ my@email": "reports_proj_ my@email",
//         "": null,
//         "my@email": "my@email"
//     },
//     "projects": [],
//     "login": "my@email",
//     "interfaces": [
//         "reports-online-show",
//         "sounds",
//         "sounds_all",
//         "reports-show",
//         "reports-executed-show",
//         "online-operators",
//         "reports-sounds-show",
//         "reports-enumeration",
//         "reports-archives",
//         "alarms",
//         "home"
//     ]
// }
