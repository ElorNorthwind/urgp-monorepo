import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDmShortTermQuery } from './util/getDmShortTermQuery';
import { formatDmRows } from './util/formatDmRows';
import {
  DmDateRangeQuery,
  dmDateRangeQuerySchema,
} from '@urgp/shared/entities';
import { getDmLongTermQuery } from './util/getDmLongTermQuery';
import { getDmIdsQuery } from './util/getDmIdsQuery';
import { generateDateRanges } from './util/generateDateRanges';
import * as oracledb from 'oracledb';
import { DgiAnalyticsService } from '@urgp/server/dgi-analytics';
import { getDmAllUndoneQuery } from './util/getDmAllUndoneQuery';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DmService {
  constructor(
    private readonly analytics: DgiAnalyticsService,
    private configService: ConfigService,
    @Inject('ORACLE_DB_POOL') private readonly pool: oracledb.Pool,
  ) {}

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
    const query = getDmShortTermQuery(q);
    Logger.log('Executing DM short-term Records query');
    const result = await this.executeQuery(query);
    const formatedRows = formatDmRows(result?.rows as unknown[][]);
    await this.analytics.db.dm.insertDmData(formatedRows);
    return formatedRows?.length || 0;
  }

  public async addDmLongTermRecords(q: DmDateRangeQuery): Promise<number> {
    const range = dmDateRangeQuerySchema.required().parse(q);
    let count = 0;
    await this.executeCallback(async (connection) => {
      const chunks = generateDateRanges(range.from, range.to, 10);

      for (const chunk of chunks) {
        this.configService.get<string>('NODE_ENV') === 'development' &&
          Logger.log(`${chunk.from} - ${chunk.to}`);
        const found = await connection.execute(getDmLongTermQuery(chunk));
        await this.analytics.db.dm.insertDmData(
          formatDmRows(found?.rows as unknown[][]),
        );
        count += found?.rows?.length || 0;
      }
    });
    return count;
  }

  public async addDmAllUndoneResolutions(): Promise<number> {
    const query = getDmAllUndoneQuery();
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
        await connection.execute(getDmIdsQuery(chunk));
        i += chunkSize;
      }
    });

    return resolutions?.length || 0;
  }
  @Cron('0 0 5 * * *')
  public async updateDailyRecords(): Promise<number> {
    Logger.log('DM daily update started');
    let count = 0;
    count += (await this.addDmShortTermRecords()) || 0;
    count += (await this.addDmAllUndoneResolutions()) || 0;
    Logger.log('DM daily update finished');
    return count;
  }
}
