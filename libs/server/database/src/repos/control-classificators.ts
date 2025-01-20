import {
  ClassificatorInfo,
  ControlOperationClass,
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
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

  readOperationTypes(
    operationClass?: ControlOperationClass,
  ): Promise<NestedClassificatorInfo[]> {
    const operationClassText =
      operationClass && typeof operationClass === 'string'
        ? this.pgp.as.format(` WHERE class = $1`, operationClass)
        : '';

    // const q = this.pgp.as.format(classificators.readOperationTypes, {
    //   operationClassText,
    // });
    // console.log(q);

    return this.db.any(classificators.readOperationTypes, {
      operationClassText,
    });
  }

  readOperationTypesFlat(
    operationClass?: ControlOperationClass,
  ): Promise<TypeInfo[]> {
    const operationClassText =
      operationClass && typeof operationClass === 'string'
        ? this.pgp.as.format(` WHERE class = $1`, operationClass)
        : '';
    return this.db.any(classificators.readOperationTypesFlat, {
      operationClassText,
    });
  }

  readCaseStatusTypes(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(classificators.readCaseStatusTypes);
  }

  readCaseDirectionTypes(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(classificators.readCaseDireactionTypes);
  }

  readDepartmentTypes(): Promise<NestedClassificatorInfoString[]> {
    return this.db.any(classificators.readDepartmentTypes);
  }

  readDirectionSubscribers(directions: number[]): Promise<TypeInfo[]> {
    return this.db.any(classificators.readDirectionSubscribers, { directions });
  }
}
