import { IDatabase, IMain } from 'pg-promise';

// @Injectable()
export class RenovationRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  // Returns geojson of old buildings;
  oldBuildingsGeoJson(): Promise<unknown[]> {
    return this.db.any(
      `SELECT
      json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(ST_AsGeoJSON(t.*)::json)
      )
    FROM
      renovation.buildings_old AS t`,
    );
  }
}
