import { IDatabase, IMain } from 'pg-promise';

type geodata = { geojson: any };

// @Injectable()
export class RenovationRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  // Returns geojson of old buildings;
  oldBuildingsGeoJson(): Promise<geodata[]> {
    return this.db.any(
      `SELECT
      json_build_object(
      'type', 'FeatureCollection',
      'features', json_agg(ST_AsGeoJSON(t.*)::json)
      ) as geojson
      FROM
      renovation.buildings_old AS t WHERE t.outline IS NOT NULL;`,
    );
  }
}
