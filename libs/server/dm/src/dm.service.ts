import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { getDmShortTermQuery } from './util/getDmShortTermQuery';
import { formatDmRows } from './util/formatDmRows';
import { runOracleQuery } from './util/runOracleQuery';
import {
  DmDateRangeQuery,
  dmDateRangeQuerySchema,
} from '@urgp/shared/entities';
import { getDmLongTermQuery } from './util/getDmLongTermQuery';
import { getDmIdsQuery } from './util/getDmIdsQuery';
import { runOracleCallback } from './util/runOracleCallback';
import { generateDateRanges } from './util/generateDateRanges';
import { toDate } from 'date-fns';

@Injectable()
export class DmService {
  constructor(
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
  ) {}

  public async addDmShortTermRecords(q?: DmDateRangeQuery): Promise<number> {
    const query = getDmShortTermQuery(q);
    const result = await runOracleQuery(this.configService, query);
    if (result?.isError) return result?.err;
    const formatedRows = formatDmRows(result?.rows as unknown[][]);
    await this.dbServise.db.dm.insertDmData(formatedRows);
    return formatedRows?.length || 0;
  }

  public async addDmLongTermRecords(q: DmDateRangeQuery): Promise<number> {
    const range = dmDateRangeQuerySchema.required().parse(q);
    let count = 0;
    await runOracleCallback(this.configService, async (connection) => {
      const chunks = generateDateRanges(range.from, range.to, 10);

      for (const chunk of chunks) {
        const found = await connection.execute(getDmLongTermQuery(chunk));
        count += found?.rows?.length || 0;
      }
    });
    return count;
  }

  public async updateActiveResolutions(): Promise<number> {
    const resolutions = await this.dbServise.db.dm.getActiveResolutions();

    await runOracleCallback(this.configService, async (connection) => {
      const chunkSize = 900;
      let i = 0;
      while (i < resolutions.length) {
        const chunk = resolutions.slice(i, i + chunkSize);
        await connection.execute(getDmIdsQuery(chunk));
        i += chunkSize;
      }
    });

    return resolutions?.length || 0;
  }
}
