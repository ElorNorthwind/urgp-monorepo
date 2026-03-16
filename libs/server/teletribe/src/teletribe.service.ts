import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { EmailService } from '@urgp/server/email';
import { AxiosResponse } from 'axios';
import { DgiAnalyticsService } from 'libs/server/dgi-analytics/src/dgi-analytics.service';
import { firstValueFrom, map } from 'rxjs';
import { reportFields } from './config/constants';
import {
  HotlineRequest,
  hotlineRequestSchema,
  RawTeletribeHotlineRecord,
  RawTeletribeReport,
  RawTeletribeScoreRecord,
} from '@urgp/shared/entities';
import { formatTeletribeRecord } from './util/formatTeletribeRecord';
import { formatTeletribeClient } from './util/formatTeletribeClient';
import { formatTeletribeScore } from './util/formatTeletribeScore';
import { generateDateRanges } from './util/generateDateRanges';
import { endOfTomorrow, format } from 'date-fns';
import { Cron } from '@nestjs/schedule';

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
  ): Promise<RawTeletribeReport> {
    const result = hotlineRequestSchema.safeParse(query);
    if (!result.success) {
      throw new BadRequestException(result.error.message);
    }
    const { dateFrom, dateTo, page, reportType, idReport } = result.data;

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
            'data[idReport]': idReport,
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

  async insertHotlineReport(
    query?: HotlineRequest,
    allowRetry: boolean = true,
  ): Promise<any> {
    const parsedQuery = hotlineRequestSchema.safeParse(query).data;

    const dateFrom = parsedQuery?.dateFrom;
    const dateTo = parsedQuery?.dateTo;
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    let clientCount = 0;
    let recordsCount = 0;
    let scoreCount = 0;

    try {
      let recordsPage = 1;
      let totalRecords = 0;
      let records = new Map();
      let recordsReportId: number | null = null;

      while (recordsPage === 1 || records.size < totalRecords) {
        const recordReport = await this.getHotlineReport({
          reportType: 'hotline',
          dateFrom,
          dateTo,
          page: recordsPage,
          idReport: recordsReportId,
        });

        totalRecords = recordReport?.countAllRows + 1 || 0;
        (recordReport?.rows || []).forEach((row) => {
          records.set(row.SESSION_ID, row);
        });
        recordsReportId =
          typeof recordReport?.idReport === 'string'
            ? parseInt(recordReport?.idReport)
            : recordReport?.idReport || null;

        isDev &&
          this.logger.log(
            `HotlineReport. Page: ${recordsPage}. Count: ${records.size}/${totalRecords}. First: ${recordReport?.rows?.[0]?.SESSION_ID}.`,
          );
        recordsPage++;
      }

      if (records.size > 0) {
        const formatedClients = Array.from(records.values())
          .map((row) => formatTeletribeClient(row as RawTeletribeHotlineRecord))
          .filter((client) => client?.id && client?.id > 0);

        clientCount =
          formatedClients?.length > 0
            ? await this.dgiAnalytics.db.vks.insertTeletribeClients(
                formatedClients,
              )
            : 0;

        const formatedRecords = Array.from(records.values())
          .map((row) => formatTeletribeRecord(row as RawTeletribeHotlineRecord))
          .filter((record) => record?.client_id && record?.client_id > 0);

        recordsCount =
          formatedRecords?.length > 0
            ? await this.dgiAnalytics.db.vks.insertTeletribeCases(
                formatedRecords,
              )
            : 0;
      }

      let scoresPage = 1;
      let totalScores = 0;
      let scores = new Map();
      let scoresReportId: number | null = null;

      while (scoresPage === 1 || scores.size < totalScores) {
        const scoreReport = await this.getHotlineReport({
          reportType: 'hotline_score',
          dateFrom,
          dateTo,
          page: scoresPage,
          idReport: scoresReportId,
        });

        totalScores = scoreReport?.countAllRows || 0;
        (scoreReport?.rows || []).forEach((row) => {
          scores.set(row?.SESSION_ID, row);
        });
        scoresReportId =
          typeof scoreReport?.idReport === 'string'
            ? parseInt(scoreReport?.idReport)
            : scoreReport?.idReport || null;

        isDev &&
          this.logger.log(
            `ScoreReport. Page: ${scoresPage}. Count: ${scores.size}/${totalScores}. First: ${scoreReport?.rows?.[0]?.SESSION_ID}.`,
          );
        scoresPage++;
      }

      if (scores.size > 0) {
        const formatedScores = Array.from(scores.values()).map((row) =>
          formatTeletribeScore(row as RawTeletribeScoreRecord),
        );
        scoreCount =
          formatedScores?.length > 0
            ? await this.dgiAnalytics.db.vks.updateTeletribeScore(
                formatedScores,
              )
            : 0;
      }

      return {
        clientCount,
        recordsCount,
        scoreCount,
        error: null,
      };
    } catch (e) {
      allowRetry
        ? this.logger.error('Hotline report error! Attempting retry...')
        : this.logger.error('Hotline report error! No retry this time.');
      this.logger.error(e);
      allowRetry && this.insertHotlineReport(query, false);
      return {
        clientCount: 0,
        recordsCount: 0,
        scoreCount: 0,
        error: e,
      };
    }
  }

  async insertLongTermHotlineReport(query?: HotlineRequest): Promise<any> {
    const parsedQuery = hotlineRequestSchema.safeParse(query).data;

    const dateFrom = parsedQuery?.dateFrom;
    const dateTo = parsedQuery?.dateTo;
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';

    let clientCount = 0;
    let recordsCount = 0;
    let scoreCount = 0;

    const chunks = generateDateRanges(
      dateFrom || '01.01.2026',
      dateTo || format(endOfTomorrow(), 'dd.MM.yyyy'),
      5,
    );

    for (const chunk of chunks) {
      isDev &&
        this.logger.log(
          `Getting hotline report: ${chunk.dateFrom} - ${chunk.dateTo}`,
        );

      try {
        const result = await this.insertHotlineReport(chunk);
        clientCount += result.clientCount;
        recordsCount += result.recordsCount;
        scoreCount += result.scoreCount;
        isDev &&
          this.logger.log(
            `SoFar: clientCount: ${clientCount}, recordsCount: ${recordsCount}, scoreCount: ${scoreCount}`,
          );
      } catch {
        this.logger.error(
          `Failed to get hotline report: ${chunk.dateFrom} - ${chunk.dateTo}`,
        );
      }
    }

    return {
      clientCount,
      recordsCount,
      scoreCount,
    };
  }

  @Cron('0 5 6,17 * * *')
  public async cronUpdateTeletribeData(forced: boolean = false) {
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    if (isDev && !forced) return;
    await this.insertHotlineReport().then(() => {
      this.logger.log(`Teletribe data updated (yesterday + today)`);
    });
  }
}
