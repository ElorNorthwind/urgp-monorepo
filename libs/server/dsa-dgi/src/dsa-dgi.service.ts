import { Injectable } from '@nestjs/common';
// import * as pgPromise from 'pg-promise';
import pgPromise from 'pg-promise';
import {
  DbExtensions,
  RenovationRepository,
  RenovationSyncRepository,
} from './repos';

type ExtendedProtocol = pgPromise.IDatabase<DbExtensions> & DbExtensions;

@Injectable()
export class DsaDgiService {
  private connection = {
    host: process.env['DSA_DGI_HOST'] || 'localhost',
    port: parseInt(process.env['DSA_DGI_PORT'] || '5432'),
    database: process.env['DSA_DGI_DATABASE'] || 'my-database-name',
    user: process.env['DSA_DGI_USER'] || 'user-name',
    password: process.env['DSA_DGI_PASSWORD'] || 'user-password',
    client_encoding: 'utf8',
  };
  db: ExtendedProtocol;
  pgp: pgPromise.IMain;

  constructor() {
    const initOptions = {
      extend(obj: ExtendedProtocol, dc: any) {
        obj.renovation = new RenovationRepository(obj, pgPromise());
        obj.renovationSync = new RenovationSyncRepository(obj, pgPromise());
      },
    };

    this.pgp = pgPromise(initOptions);
    this.db = this.pgp(this.connection);
  }
}

// example:  https://github.com/vitaly-t/pg-promise-demo/blob/master/TypeScript/README.md
// libraty implementation: https://github.com/rubiin/nestjs-pgpromise/blob/master/src/nest-pgpromise.service.ts
