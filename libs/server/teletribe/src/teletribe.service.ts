import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { EmailService } from '@urgp/server/email';
import { AxiosResponse } from 'axios';
import { format, subDays } from 'date-fns';
import { DgiAnalyticsService } from 'libs/server/dgi-analytics/src/dgi-analytics.service';
import { firstValueFrom, map } from 'rxjs';
import {
  HOTLINE_REPORT_DATA,
  HOTLINE_SCORE_REPORT_DATA,
  OUTBOUND_REPORT_DATA,
  reportFields,
} from './config/constants';
import { HotlineRequest, hotlineRequestSchema } from '@urgp/shared/entities';

@Injectable()
export class TeletribeService {
  private readonly logger = new Logger(TeletribeService.name);
  private tokens: Map<string, string> = new Map();
  private fa2RequestDate: Date | null = null;

  constructor(
    private configService: ConfigService,
    private readonly dbServise: DatabaseService,
    private readonly dgiAnalytics: DgiAnalyticsService,
    private readonly axios: HttpService,
    private readonly email: EmailService,
  ) {}

  // ================================================
  // ============ ХЭЛПЕР-ФУНКЦИИ ТОКЕНОВ ============
  // ================================================
  private getTokenCookies(): string | null {
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

  private resetTokens() {
    this.tokens.clear();
  }

  // ================================================
  // ====== ПРОМЕЖУТОЧНЫЕ ЗАПРОСЫ АВТОРИЗАЦИИ =======
  // ================================================

  private async setAccessToken(to: string): Promise<Map<string, string>> {
    await firstValueFrom(
      this.axios
        .request({
          url: '/access.php',
          method: 'POST',
          headers: { cookie: this.getTokenCookies() },
          data: {
            to,
          },
        })
        .pipe(map((response) => this.setTokenFromResponse(response))),
    );
    return this.tokens;
  }

  private async authenticateSessionToken(): Promise<Map<string, string>> {
    const login = this.configService.get<string>('TELETRIBE_LOGIN');
    const password = this.configService.get<string>('TELETRIBE_PASSWORD');

    if (!login || !password) {
      throw new Error('Teletribe credentials are missing');
    }

    // Логин пользователя и получение сессии
    await firstValueFrom(
      this.axios
        .request({
          url: '/auth.php',
          method: 'POST',
          data: {
            'data[login]': login,
            'data[password]': password,
          },
          headers: {
            Cookie: this.getTokenCookies(),
          },
        })
        .pipe(
          map((response) => {
            this.setTokenFromResponse(response);
            return response?.data;
          }),
        ),
    );
    return this.tokens;
  }

  private async request2faCode(): Promise<void> {
    // Запрос кода на почту
    await firstValueFrom(
      this.axios
        .request({
          url: `/auth-2fa.php?${this.tokens.get('varwwwhtmlrsbackendconfig')}&alter=false`,
          method: 'GET',
          headers: {
            cookie: this.getTokenCookies(),
          },
        })
        .pipe(
          map((response) => {
            if (response.status !== 200) {
              new Error(
                `Failed to request 2fa code, status code: ${response.status}`,
              );
            }
          }),
        ),
    );
  }

  private async send2faCode(code: number): Promise<void> {
    await firstValueFrom(
      this.axios
        .request({
          url: `/auth-2fa.php`,
          method: 'POST',
          headers: {
            cookie: this.getTokenCookies(),
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
  }

  private async get2faCodeEmail(): Promise<number> {
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

  // ================================================
  // ================ БИЗНЕС-ЛОГИКА =================
  // ================================================

  // Запрос на обновление авторизации
  public async setAuthTokens(
    resetOldTokens: boolean = true,
  ): Promise<Map<string, string>> {
    resetOldTokens && this.resetTokens(); // Сбрасываем ранее сохраненные токены
    await this.authenticateSessionToken(); // Входим, получаем токен сессии
    await this.request2faCode(); // Запрашиваем проверочный код на почту
    const code = await this.get2faCodeEmail(); // Забираем код с почты
    await this.send2faCode(code); // Передаем проверочный код
    await this.setAccessToken('reports-show'); // Получаем токен доступа к отчету
    return this.tokens;
  }

  async getHotlineReport(
    query?: HotlineRequest,
    noAuthRetry: boolean = false,
  ): Promise<any> {
    const result = hotlineRequestSchema.safeParse(query);
    if (!result.success) {
      throw new BadRequestException(result.error.message);
    }
    const { dateFrom, dateTo, page, reportType } = result.data;

    // Проверка на наличие сохраненных токенов
    const token = this.tokens.get('varwwwhtmlrsbackendconfig');
    if (!token) {
      if (!noAuthRetry) {
        await this.setAuthTokens();
        return this.getHotlineReport(query, true);
      }
      throw new Error('Failed to get teletribe session token');
    }

    const reportData = await firstValueFrom(
      this.axios
        .request({
          url: `/handler.php`,
          method: 'POST',
          headers: {
            cookie: this.getTokenCookies(),
          },
          data: {
            ...reportFields[reportType],
            'data[requestId]': Date.now(),
            'data[variables][0][value]': dateFrom,
            'data[variables][1][value]': dateTo,
            'data[page]': page,
            token,
          },
        })
        .pipe(
          map(async (response) => {
            // В случае если сохраненный токен не актуален
            if (response.status === 403) {
              if (!noAuthRetry) {
                await this.setAuthTokens();
                return this.getHotlineReport(query, true);
              }
              throw new Error('Failed to get teletribe report (403)');
            }
            return response?.data;
          }),
        ),
    );
    return reportData;
  }
}
