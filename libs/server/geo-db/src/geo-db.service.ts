import { Injectable } from '@nestjs/common';
// import * as pgPromise from 'pg-promise';
import pgPromise from 'pg-promise';
import { DbExtensions, DataMosRepository } from './repos';

type ExtendedProtocol = pgPromise.IDatabase<DbExtensions> & DbExtensions;

@Injectable()
export class GeoDbService {
  private connection = {
    host: process.env['GEO_PG_HOST'] || 'localhost',
    port: parseInt(process.env['GEO_PG_PORT'] || '5432'),
    database: process.env['GEO_PG_DATABASE'] || 'my-database-name',
    user: process.env['GEO_PG_USER'] || 'user-name',
    password: process.env['GEO_PG_PASSWORD'] || 'user-password',
    client_encoding: 'utf8',
  };
  db: ExtendedProtocol;
  pgp: pgPromise.IMain;

  constructor() {
    const initOptions = {
      extend(obj: ExtendedProtocol, dc: any) {
        obj.dataMos = new DataMosRepository(obj, pgPromise());
      },
    };

    this.pgp = pgPromise(initOptions);
    this.db = this.pgp(this.connection);
  }
}

// example:  https://github.com/vitaly-t/pg-promise-demo/blob/master/TypeScript/README.md
// libraty implementation: https://github.com/rubiin/nestjs-pgpromise/blob/master/src/nest-pgpromise.service.ts
