import {
  ClassificatorInfo,
  NestedClassificatorInfo,
  TypeInfo,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { classificators } from './sql/sql';

// @Injectable()
export class ControlClassificatorsRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  readCaseTypes(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(classificators.readCaseTypes);
  }

  readOperationTypes(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(classificators.readOperationTypes);
  }

  readOperationTypesFlat(): Promise<TypeInfo[]> {
    return this.db.any(classificators.readOperationTypesFlat);
  }

  readCaseStatusTypes(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(classificators.readCaseStatusTypes);
  }

  readCaseDirectionTypes(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(classificators.readCaseDireactionTypes);
  }
}
