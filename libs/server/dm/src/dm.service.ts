import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import * as oracledb from 'oracledb';
import { ConfigService } from '@nestjs/config';
import { categoryIds } from './config/constants';
import { mapDmRecord } from './util/mapDmRecord';
import { getDmDateRangeQuery } from './util/getDmDateRangeQuery';
import { setOracleClient } from './util/setOracleClient';

const resultColumngs = [
  { name: 'resolutionId' },
  { name: 'resolutionText' },
  { name: 'controlDate', cast: 'timestamp with time zone' },
  { name: 'doneDate', cast: 'timestamp with time zone' },
  { name: 'documentId' },
  { name: 'registrationNumber' },
  { name: 'fromFio' },
  { name: 'registrationDate', cast: 'timestamp with time zone' },
  { name: 'categoryId' },
];

@Injectable()
export class DmService {
  constructor(
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
  ) {}

  public async test(): Promise<any> {
    const query = getDmDateRangeQuery();

    let connection;

    try {
      setOracleClient(this.configService.get('ORACLE_INSTANT_CLIENT_DIR'));

      connection = await oracledb.getConnection({
        user: this.configService.get('DM_USERNAME') || 'user',
        password: this.configService.get('DM_PASSWORD') || 'password',
        connectString:
          `${this.configService.get('DM_HOST')}:${this.configService.get('DM_PORT')}/${this.configService.get('DM_SERVICE_NAME')}` ||
          'localhost:1521/xe',
      });
      Logger.log('Successfully connected to Oracle');
      // ----------------------------------------------------------------------
      const result = await connection.execute(query);
      const rows =
        result?.rows?.map((r) => mapDmRecord(r as Array<string | number>)) ||
        [];
      Logger.debug(
        this.dbServise.pgp.helpers.values(rows.slice(0, 1), resultColumngs),
      );
      return rows;
      // ----------------------------------------------------------------------
    } catch (err) {
      Logger.error('Error connecting to Oracle:', err);
      // ----------------------------------------------------------------------
      return err;
      // ----------------------------------------------------------------------
    } finally {
      if (connection) {
        try {
          await connection.close();
          Logger.log('Connection to Oracle closed.');
        } catch (err) {
          Logger.error('Error closing connection to Oracle:', err);
        }
      }
    }
  }
}
