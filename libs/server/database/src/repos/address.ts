import {
  AddressReslutUpdate,
  AddressSession,
  AddressSessionFull,
  CreateAddressSessionDto,
  RatesDailyUsage,
  UnfinishedAddress,
  UpdateAddressSessionDto,
} from '@urgp/shared/entities';
import {
  AdressRegistryRowCalcStreetData,
  AdressRegistryRowSlim,
} from 'libs/server/data-mos/src/config/types';
import { IDatabase, IMain } from 'pg-promise';
import { camelToSnakeCase } from '../lib/to-snake-case';
import { dataMos, rates, results, sessions } from './sql/sql';

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

  insertSession(dto: CreateAddressSessionDto, userId: number): Promise<number> {
    const columns = [{ name: 'user_id', prop: 'userId' }];
    Object.keys(dto).forEach((key) => {
      columns.push({ name: camelToSnakeCase(key), prop: key });
    });
    const sessionColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'sessions',
        schema: 'address',
      },
    });
    const insert =
      this.pgp.helpers.insert({ ...dto, userId }, sessionColumnSet) +
      ' returning id;';

    return this.db.one(insert).then((result: any) => result.id);
  }

  updateSession(dto: UpdateAddressSessionDto): Promise<AddressSession> {
    const columns = [
      { name: 'id', prop: 'id', cnd: true },
      { name: 'updated_at', prop: 'updatedAt' },
    ] as {
      name: string;
      prop?: string;
      cnd?: boolean;
    }[];

    Object.keys(dto)
      .filter((key) => key !== 'id')
      .forEach((key) => {
        columns.push({ name: camelToSnakeCase(key), prop: key });
      });

    const sessionColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'sessions',
        schema: 'address',
      },
    });

    const update =
      this.pgp.helpers.update(
        { ...dto, updatedAt: new Date().toISOString() },
        sessionColumnSet,
      ) + ` WHERE id = ${dto.id} RETURNING *`;
    return this.db.one(update);
  }

  deleteSession(id: number): Promise<null> {
    return this.db.none(sessions.deleteSession, { id });
  }

  resetSessionErrors(id: number): Promise<null> {
    return this.db.none(results.resetSessionErrorsById, { id });
  }

  deleteSessionsOlderThan(date: string): Promise<null> {
    return this.db.none(sessions.deleteSessionsOlderThan, { date });
  }

  getSessionById(id: number): Promise<AddressSessionFull | null> {
    return this.db.oneOrNone(sessions.getSessionById, { id });
  }

  getSessionsByUserId(userId: number): Promise<AddressSessionFull[]> {
    return this.db.any(sessions.getSessionsByUserId, { userId });
  }

  getSessionQueue(): Promise<AddressSessionFull[]> {
    return this.db.any(sessions.getSessionsQueue);
  }

  getAddressResultsBySessionId(sessionId: number): Promise<any[]> {
    return this.db.any(results.getAddressResultsBySessionId, { sessionId });
  }

  insertSessionAddresses(
    addresses: string[],
    sessionId: number,
  ): Promise<null> {
    const resultTableColumnSet = new this.pgp.helpers.ColumnSet(
      [
        { name: 'session_id', prop: 'sessionId' },
        { name: 'original_address', prop: 'address' },
        { name: 'session_npp', prop: 'npp' },
      ],
      {
        table: {
          table: 'results',
          schema: 'address',
        },
      },
    );

    const insert = this.pgp.helpers.insert(
      addresses.map((a, i) => ({ sessionId, address: a, npp: i + 1 })),
      resultTableColumnSet,
    );

    return this.db.none(insert);
  }
  getSessionUnfinishedAddresses(
    sessionId: number,
    limit = 1000,
  ): Promise<UnfinishedAddress[]> {
    return this.db.any(results.getSessionUnfinishedBatch, {
      sessionId,
      limit,
    });
  }
  getRatesDailyUsage(): Promise<RatesDailyUsage> {
    return this.db.one(rates.getDailyUsage);
  }

  insertRatesUsage(
    sessionId: number,
    amount: number,
    responseSource: string = 'fias',
  ): Promise<null> {
    const q = this.pgp.as.format(rates.insertSpendRates, {
      sessionId,
      responseSource,
      amount,
    });

    return this.db.none(q);
  }

  updateAddressResult(results: AddressReslutUpdate[]): Promise<null> {
    if (results.length === 0) return Promise.resolve(null);
    const columns = [
      { name: 'id', prop: 'id', cnd: true },
      { name: 'response', prop: 'response', cast: 'jsonb' },
      {
        name: 'updated_at',
        prop: 'updatedAt',
        cast: 'timestamp with time zone',
      },
    ] as {
      name: string;
      prop?: string;
      cnd?: boolean;
    }[];

    const customColumnProps = columns.map((col) => col.prop);

    Object.keys(results[0])
      .filter((key) => !customColumnProps.includes(key))
      .forEach((key) => {
        columns.push({ name: camelToSnakeCase(key), prop: key });
      });

    const resultTableColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'results',
        schema: 'address',
      },
    });

    const update =
      this.pgp.helpers.update(results, resultTableColumnSet) +
      ' WHERE v.id = t.id';
    return this.db.none(update);
  }
  addUnomsToResultAddress(sessionId: number): Promise<null> {
    return this.db.none(results.addUnomsToResultAddress, { sessionId });
  }
}
