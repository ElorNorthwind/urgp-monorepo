import { IDatabase, IMain } from 'pg-promise';
import {
  AdressRegistryRowCalcStreetData,
  AdressRegistryRowSlim,
} from 'libs/server/data-mos/src/config/types';
import { Logger } from '@nestjs/common';
import { dataMos } from './sql/sql';
import { CreateAddressSessionDto } from '@urgp/shared/entities';

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
  // { name: 'outline', mod: '^' }, // Handle geometry as raw SQL
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
  { name: 'street_calc' },
];

// @Injectable()
export class AddressRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  upsertAdresses(addresses: any[]): Promise<null> {
    const addressRegistryColumnSet = new this.pgp.helpers.ColumnSet(
      adressRegistryColumns,
      {
        table: {
          table: 'address_registry',
          schema: 'address',
        },
      },
    );

    const insert = this.pgp.helpers.insert(addresses, addressRegistryColumnSet);
    const q = this.pgp.as.format(dataMos.upsertAddresses, {
      insert,
    });
    // Logger.warn(q);
    return this.db.none(q);
  }

  countUpdated(): Promise<number> {
    return this.db
      .one(dataMos.countUpdated)
      .then((result) => result?.total ?? 0);
  }

  countTotal(): Promise<number> {
    return this.db.one(dataMos.countTotal).then((result) => result?.total ?? 0);
  }
  clearUpdated(): Promise<null> {
    return this.db.none(dataMos.clearUpdated);
  }
  readPaginatedAddresses({
    limit = 1000,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  }): Promise<AdressRegistryRowSlim[]> {
    return this.db.any(dataMos.readPaginatedAddresses, { limit, offset });
  }

  updateCalcStreets(data: AdressRegistryRowCalcStreetData[]): Promise<null> {
    const addressRegistryColumnSet = new this.pgp.helpers.ColumnSet(
      [{ name: 'global_id', cnd: true }, { name: 'street_calc' }],
      {
        table: {
          table: 'address_registry',
          schema: 'address',
        },
      },
    );
    const update = this.pgp.helpers.update(data, addressRegistryColumnSet);

    // Logger.warn(update);

    return this.db.none(update + ' WHERE v.global_id = t.global_id');
  }

  insertSession(dto: CreateAddressSessionDto, userId: number): void {
    const sessionColumnSet = new this.pgp.helpers.ColumnSet(
      [
        { name: 'type', prop: 'type' },
        { name: 'title', prop: 'title' },
        { name: 'notes', prop: 'notes' },
        { name: 'user_id', prop: 'userId' },
      ],
      {
        table: {
          table: 'sessions',
          schema: 'address',
        },
      },
    );
    const insert = this.pgp.helpers.update(
      { ...dto, userId },
      sessionColumnSet,
    );
    Logger.warn(insert);

    // return this.db.one(update + ' WHERE v.global_id = t.global_id');
  }
}
