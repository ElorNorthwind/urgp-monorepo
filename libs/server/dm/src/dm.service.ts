import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDmShortTermQuery } from './util/getDmShortTermQuery';
import { formatDmRows } from './util/formatDmRows';
import {
  DmDateRangeQuery,
  UPDATE_STATES,
  UpdateStatus,
  dmDateRangeQuerySchema,
} from '@urgp/shared/entities';
import { getDmLongTermQuery } from './util/getDmLongTermQuery';
import { getDmIdsQuery } from './util/getDmIdsQuery';
import { generateDateRanges } from './util/generateDateRanges';
import * as oracledb from 'oracledb';
import { DgiAnalyticsService } from '@urgp/server/dgi-analytics';
import { getDmAllUndoneQuery } from './util/getDmAllUndoneQuery';
import { Cron } from '@nestjs/schedule';
import { getDmDocIdsQuery } from './util/getDmDocIdsQuery';
import { getDmSuspencesQuery } from './util/getDmSuspencesQuery';
import { formatDmSuspences } from './util/formatDmSuspences';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DmService implements OnModuleInit {
  private statusSubject = new BehaviorSubject<UpdateStatus>({
    name: 'dm',
    state: UPDATE_STATES['IDLE'],
    progress: 0,
    message: 'Загрузка статуса...',
  });
  // private isRunning = false;
  private currentUpdatePromise: Promise<void> | null = null;
  constructor(
    private readonly analytics: DgiAnalyticsService,
    private configService: ConfigService,
    @Inject('ORACLE_DB_POOL') private readonly pool: oracledb.Pool,
  ) {}
  async onModuleInit() {
    try {
      const savedStatus = await this.analytics.db.dm.getUpdateStatus('dm');
      if (savedStatus) {
        this.setUpdateStatus({
          ...savedStatus,
          name: 'dm',
          state: UPDATE_STATES['IDLE'],
          progress: 0,
          message: 'Сервер готов к запуску обновлений',
        });
      } else {
        this.setUpdateStatus({
          name: 'dm',
          state: UPDATE_STATES['IDLE'],
          progress: 0,
          message: 'Сервер готов к запуску обновлений',
        });
      }
    } catch (error) {
      Logger.error('Faled to load DM update status from DB: ', error);
      this.statusSubject.next({
        name: 'dm',
        state: UPDATE_STATES['IDLE'],
        progress: 0,
        message:
          'Не удалось получить статус из базы данных, загружен стандартный',
      });
    }
  }

  private async setUpdateStatus(status: UpdateStatus): Promise<void> {
    this.statusSubject.next(status);
    await this.analytics.db.dm.setUpdateStatus(status);
  }

  getStatusStream(): Observable<UpdateStatus> {
    return this.statusSubject.asObservable();
  }

  getStatus(): UpdateStatus {
    return this.statusSubject.getValue();
  }

  async startUpdate(): Promise<void> {
    if (this.getStatus()?.state === 'running') {
      throw new ConflictException('Обновление уже выполняется');
    }

    await this.setUpdateStatus({
      ...this.getStatus(),
      name: 'dm',
      state: UPDATE_STATES['RUNNING'],
      progress: 0,
      message: 'Обновление запущено',
      startedAt: new Date(),
    });
    this.currentUpdatePromise = this.performUpdate();

    try {
      await this.currentUpdatePromise;
    } catch (error) {
      await this.setUpdateStatus({
        ...this.getStatus(),
        name: 'dm',
        state: UPDATE_STATES['FAILED'],
        progress: this.getStatus()?.progress || 0,
        message: 'При обновлении произошла ошибка',
      });
      throw error;
    } finally {
      this.currentUpdatePromise = null;
    }
  }

  private async performUpdate() {
    this.setUpdateStatus({
      ...this.getStatus(),
      progress: 2,
      message: 'Обновляем вновь поступившие документы',
    });
    await this.addDmShortTermRecords();
    this.setUpdateStatus({
      ...this.getStatus(),
      progress: 5,
      message: 'Обновляем ранее загруженные документы',
    });
    await this.updateAllResolutions();
    this.setUpdateStatus({
      ...this.getStatus(),
      progress: 95,
      message: 'Обновляем статус приостановок в СПД',
    });
    await this.updateSuspences();

    await this.setUpdateStatus({
      ...this.getStatus(),
      state: UPDATE_STATES['COMPLETED'],
      progress: 100,
      message: 'Обновление успешно завершено',
      completetAt: new Date(),
    });
  }

  private async executeQuery(
    sql: string,
    binds: any = {},
    options: oracledb.ExecuteOptions = {
      // outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  ): Promise<oracledb.Result<any>> {
    let connection: oracledb.Connection | undefined;
    try {
      connection = await this.pool.getConnection();
      return connection.execute(sql, binds, options);
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  private async executeCallback(
    callback: (connection: oracledb.Connection) => Promise<void>,
  ): Promise<void> {
    let connection: oracledb.Connection | undefined;
    try {
      connection = await this.pool.getConnection();
      await callback(connection);
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  public async addDmShortTermRecords(q?: DmDateRangeQuery): Promise<number> {
    const categoryIds = await this.analytics.db.dm.getCategoryIds();
    const query = getDmShortTermQuery(categoryIds, q);
    Logger.log('Executing DM short-term Records query');
    const result = await this.executeQuery(query);
    const formatedRows = formatDmRows(result?.rows as unknown[][]);
    await this.analytics.db.dm.insertDmData(formatedRows);
    return formatedRows?.length || 0;
  }

  public async addDmLongTermRecords(
    q: DmDateRangeQuery,
    group?: string,
  ): Promise<number> {
    const categoryIds = await this.analytics.db.dm.getCategoryIds(group);
    const range = dmDateRangeQuerySchema.required().parse(q);
    let count = 0;
    await this.executeCallback(async (connection) => {
      const chunks = generateDateRanges(range.from, range.to, 10);

      for (const chunk of chunks) {
        this.configService.get<string>('NODE_ENV') === 'development' &&
          Logger.log(`${chunk.from} - ${chunk.to}`);
        const found = await connection.execute(
          getDmLongTermQuery(categoryIds, chunk),
        );
        await this.analytics.db.dm.insertDmData(
          formatDmRows(found?.rows as unknown[][]),
        );
        count += found?.rows?.length || 0;
      }
    });
    return count;
  }

  public async addDmAllUndoneResolutions(): Promise<number> {
    const categoryIds = await this.analytics.db.dm.getCategoryIds();
    const query = getDmAllUndoneQuery(categoryIds);
    const result = await this.executeQuery(query);
    const formatedRows = formatDmRows(result?.rows as unknown[][]);
    await this.analytics.db.dm.insertDmData(formatedRows);
    return formatedRows?.length || 0;
  }

  public async updateActiveResolutions(): Promise<number> {
    const resolutions = await this.analytics.db.dm.getActiveResolutions();

    await this.executeCallback(async (connection) => {
      const chunkSize = 900;
      let i = 0;
      while (i < resolutions.length) {
        Logger.log('Executing DM update for active resolutions, count: ' + i);
        const chunk = resolutions.slice(i, i + chunkSize);
        const resultChunk = await connection.execute(getDmIdsQuery(chunk));
        const formatedRows = formatDmRows(resultChunk?.rows as unknown[][]);
        await this.analytics.db.dm.insertDmData(formatedRows);
        i += chunkSize;
      }
    });

    return resolutions?.length || 0;
  }

  public async updateSuspences(): Promise<number> {
    const docs = await this.analytics.db.dm.getSpdUndoneDocuments();

    await this.executeCallback(async (connection) => {
      const chunkSize = 900;
      let i = 0;
      while (i < docs.length) {
        Logger.log(
          'Executing DM update for suspences: ' + i + ' / ' + docs.length,
        );
        // Не пишем в базу, но обновляем живой статус
        this.statusSubject.next({
          ...this.getStatus(),
          progress: Math.round((i / docs.length) * 5 + 95),
          message: `Обновляем приостановки в СПД (${new Intl.NumberFormat('ru-RU').format(i)} из ${new Intl.NumberFormat('ru-RU').format(docs.length)})`,
        });

        const chunk = docs.slice(i, i + chunkSize);

        const resultChunk = await connection.execute(
          getDmSuspencesQuery(chunk),
        );
        const formatedRows = formatDmSuspences(
          resultChunk?.rows as unknown[][],
        );
        await this.analytics.db.dm.insertDmSuspences(formatedRows);
        i += chunkSize;
      }
    });
    await this.analytics.db.dm.updateSuspensionControlDates();
    return docs?.length || 0;
  }

  public async updateAllResolutions(): Promise<number> {
    const documents = await this.analytics.db.dm.getAllDocuments();

    await this.executeCallback(async (connection) => {
      const chunkSize = 600;
      let i = 0;
      while (i < documents.length) {
        Logger.log(
          'Executing DM update for all resolutions, count: ' +
            i +
            ' / ' +
            documents.length,
        );
        // Не пишем в базу, но обновляем живой статус
        this.statusSubject.next({
          ...this.getStatus(),
          progress: Math.round((i / documents.length) * 90 + 5),
          message: `Обновляем ранее загруженные документы (${new Intl.NumberFormat('ru-RU').format(i)} из ${new Intl.NumberFormat('ru-RU').format(documents.length)})`,
        });
        const chunk = documents.slice(i, i + chunkSize);
        const resultChunk = await connection.execute(getDmDocIdsQuery(chunk));
        const formatedRows = formatDmRows(resultChunk?.rows as unknown[][]);
        await this.analytics.db.dm.insertDmData(formatedRows);
        await this.analytics.db.dm.deleteMissingDocuments(formatedRows, chunk);
        i += chunkSize;
      }
    });

    return documents?.length || 0;
  }

  public async updateSingleResolution(id: number): Promise<any> {
    let result: any;
    await this.executeCallback(async (connection) => {
      const resultChunk = await connection.execute(getDmDocIdsQuery([id]));
      const formatedRows = formatDmRows(resultChunk?.rows as unknown[][]);
      await this.analytics.db.dm.insertDmData(formatedRows);
      result = formatedRows?.[0];
    });

    return result;
  }

  @Cron('0 0 5 * * *')
  public async updateDailyRecords(): Promise<void> {
    Logger.log('DM daily update started');
    await this.startUpdate();
    Logger.log('DM daily update finished');
  }
}
