import { TypeInfo } from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { classificators } from './sql/sql';

// @Injectable()
export class ControlClassificatorsRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  readOperationTypes(): Promise<TypeInfo[]> {
    return this.db.one(classificators.readOperationTypes);
  }
}
