import {
  AdressRegistryRowSlim,
  TransportStationRow,
} from 'libs/server/data-mos/src/config/types';
import pgPromise, { IDatabase, IMain } from 'pg-promise';
import { dataMos } from './sql/sql';
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
  {
    name: 'geo_data',
    mod: ':raw',
    init: (d: any) =>
      pgPromise.as.format(
        `CASE WHEN data_mos.is_valid_geo_json('${d.source.geo_data}') THEN ST_GeomFromGeoJSON('${d.source.geo_data}') ELSE NULL END`,
      ),
    // pgPromise.as.format(
    //   `ST_GeomFromGeoJSON('${JSON.stringify(d.source.geo_data)}')`,
    // ),
    // pgPromise.as.format(
    //   `CASE WHEN '${JSON.stringify(d.source.geo_data)}' ~* '^{"Type":.*"Coordinates":.*}$' AND ST_IsValid(ST_GeomFromGeoJSON('${JSON.stringify(d.source.geo_data)}')) THEN ST_GeomFromGeoJSON('${JSON.stringify(d.source.geo_data)}') ELSE NULL END`,
    // ),
  },
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

const transportStationsColumns = [
  { name: 'id' },
  { name: 'name' },
  { name: 'on_territory_of_moscow' },
  { name: 'adm_area' },
  { name: 'district' },
  { name: 'vestibule_type' },
  { name: 'name_of_station' },
  { name: 'line' },
  { name: 'cultural_heritage_site_status' },
  { name: 'object_status' },
  {
    name: 'geo_data',
    mod: ':raw',
    init: (d: any) =>
      pgPromise.as.format(
        `CASE WHEN data_mos.is_valid_geo_json('${d.source.geo_data}') THEN ST_GeomFromGeoJSON('${d.source.geo_data}') ELSE NULL END`,
      ),
  },
  { name: 'station_type' },
];

// @Injectable()
export class DataMosRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  upsertAdresses(addresses: any[]): Promise<null> {
    if (!addresses || !addresses.length) return Promise.resolve(null);

    // Logger.debug(addresses[0].geo_data);
    // Logger.debug(JSON.stringify(addresses[0].geo_data));

    const addressRegistryColumnSet = new this.pgp.helpers.ColumnSet(
      adressRegistryColumns,
      {
        table: {
          table: 'address_registry',
          schema: 'data_mos',
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

  upsertTransportStations(stations: TransportStationRow[]): Promise<null> {
    const transportStationsColumnSet = new this.pgp.helpers.ColumnSet(
      transportStationsColumns,
      {
        table: {
          table: 'transport_stations',
          schema: 'data_mos',
        },
      },
    );

    const insert = this.pgp.helpers.insert(
      stations,
      transportStationsColumnSet,
    );
    const q = this.pgp.as.format(dataMos.upsertTransportStations, {
      insert,
    });
    // Logger.warn(q);
    return this.db.none(q);
  }

  getTransportStations(): Promise<TransportStationRow[]> {
    return this.db.any(dataMos.getTransportStations);
  }

  countUpdated(): Promise<number> {
    const sql = `SELECT COUNT(*)::integer as total
FROM address.address_registry
WHERE updated_at IS NOT NULL;`;

    return this.db.one(sql).then((result) => result?.total ?? 0);
  }

  countTotal(): Promise<number> {
    const sql = `SELECT 
    COUNT(*)::integer as total
FROM address.address_registry;`;

    return this.db.one(sql).then((result) => result?.total ?? 0);
  }
  clearUpdated(): Promise<null> {
    const sql = `UPDATE 
address.address_registry
SET updated_at = null;`;
    return this.db.none(sql);
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
}
