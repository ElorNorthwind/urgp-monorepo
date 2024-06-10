import { Injectable } from '@nestjs/common';
// import * as pgPromise from 'pg-promise';
import pgPromise from 'pg-promise';
import {
  DbExtensions,
  QuestionsRepository,
  RenovationRepository,
  StreetsRepository,
  UsersRepository,
} from './repos';
import { CasesRepository } from './repos';

type ExtendedProtocol = pgPromise.IDatabase<DbExtensions> & DbExtensions;

@Injectable()
export class DatabaseService {
  private connection = {
    host: process.env['PG_HOST'] || 'localhost',
    port: parseInt(process.env['PG_PORT'] || '5432'),
    database: process.env['PG_DATABASE'] || 'my-database-name',
    user: process.env['PG_USER'] || 'user-name',
    password: process.env['PG_PASSWORD'] || 'user-password',
    client_encoding: 'utf8',
  };
  db: ExtendedProtocol;
  pgp: pgPromise.IMain;

  constructor() {
    const initOptions = {
      extend(obj: ExtendedProtocol, dc: any) {
        obj.users = new UsersRepository(obj, pgPromise());
        obj.cases = new CasesRepository(obj, pgPromise());
        obj.questions = new QuestionsRepository(obj, pgPromise());
        obj.streets = new StreetsRepository(obj, pgPromise());
        obj.renovation = new RenovationRepository(obj, pgPromise());
      },
    };

    this.pgp = pgPromise(initOptions);
    this.db = this.pgp(this.connection);
  }
}

// example:  https://github.com/vitaly-t/pg-promise-demo/blob/master/TypeScript/README.md
// libraty implementation: https://github.com/rubiin/nestjs-pgpromise/blob/master/src/nest-pgpromise.service.ts
