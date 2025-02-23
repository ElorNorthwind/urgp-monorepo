import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  Classificator,
  OperationClass,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { adress, classificators } from './sql/sql';
import { Logger } from '@nestjs/common';

// const pgp = require('pg-promise')();
// const { ColumnSet } = pgp.helpers;

const adressRegistryColumns = [
  { name: 'global_id' },
  { name: 'on_territory_of_moscow' },
  { name: 'unom' },
  { name: 'address' },
  { name: 'simple_address' },
  { name: 'adm_area' },
  { name: 'district' },
  { name: 'nreg' },
  { name: 'dreg' },
  { name: 'n_fias' },
  { name: 'd_fias' },
  { name: 'kladr' },
  { name: 'tdoc' },
  { name: 'ndoc' },
  { name: 'ddoc' },
  { name: 'obj_type' },
  { name: 'adr_type' },
  { name: 'vid' },
  { name: 'sostad' },
  { name: 'status' },
  { name: 'kad_n' },
  { name: 'kad_zu' },
  { name: 'outline', mod: '^' }, // Handle geometry as raw SQL
  { name: 'p0' },
  { name: 'p1' },
  { name: 'p2' },
  { name: 'p3' },
  { name: 'p4' },
  { name: 'p5' },
  { name: 'p6' },
  { name: 'p7' },
  { name: 'p90' },
  { name: 'p91' },
  { name: 'l1_type' },
  { name: 'l1_value' },
  { name: 'l2_type' },
  { name: 'l2_value' },
  { name: 'l3_type' },
  { name: 'l3_value' },
  { name: 'l4_type' },
  { name: 'l4_value' },
  { name: 'l5_type' },
  { name: 'l5_value' },
];

// @Injectable()
export class AdressRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  upsertAdresses(adresses: any[]): Promise<null> {
    const addressRegistryColumnSet = new this.pgp.helpers.ColumnSet(
      adressRegistryColumns,
      {
        table: 'adress_registry',
      },
    );

    const insert = this.pgp.helpers.insert(adresses, addressRegistryColumnSet);
    const q = this.pgp.as.format(adress.upsertAdresses, {
      insert,
    });
    // Logger.warn(q);
    return this.db.none(q);
  }
}
