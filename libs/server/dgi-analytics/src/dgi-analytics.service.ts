import { Injectable } from '@nestjs/common';
// import * as pgPromise from 'pg-promise';
import pgPromise from 'pg-promise';
import { DbExtensions, VksRepository } from './repos';

type ExtendedProtocol = pgPromise.IDatabase<DbExtensions> & DbExtensions;

@Injectable()
export class DgiAnalyticsService {
  private connection = {
    host: process.env['DGI_ANALYTICS_PG_HOST'] || 'localhost',
    port: parseInt(process.env['DGI_ANALYTICS_PG_PORT'] || '9696'),
    database: process.env['DGI_ANALYTICS_PG_DATABASE'] || 'my-database-name',
    user: process.env['DGI_ANALYTICS_PG_USER'] || 'user-name',
    password: process.env['DGI_ANALYTICS_PG_PASSWORD'] || 'user-password',
    client_encoding: 'utf8',
  };
  db: ExtendedProtocol;
  pgp: pgPromise.IMain;

  constructor() {
    const initOptions = {
      extend(obj: ExtendedProtocol, dc: any) {
        obj.vks = new VksRepository(obj, pgPromise());
      },
    };

    this.pgp = pgPromise(initOptions);
    this.db = this.pgp(this.connection);
  }
}

// example:  https://github.com/vitaly-t/pg-promise-demo/blob/master/TypeScript/README.md
// libraty implementation: https://github.com/rubiin/nestjs-pgpromise/blob/master/src/nest-pgpromise.service.ts
