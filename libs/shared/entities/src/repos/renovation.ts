import { IDatabase, IMain } from 'pg-promise';
import { GetOldBuldingsDto } from '../model/dto/getOldBuildings';
import { OldBuilding } from '../model/types/oldBuildings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Returns old houses for renovation;
  getOldHouses(dto: GetOldBuldingsDto): Promise<OldBuilding[]> {
    const { limit = 100, page = 1, okrug, district } = dto;
    const offset = (page - 1) * limit;
    const where = [];
    if (okrug) {
      where.push(`okrug = '${okrug}'`);
    }
    if (district) {
      where.push(`district = '${district}'`);
    }
    const whereSql = where.length > 0 ? ` WHERE ${where.join(' AND ')}` : '';
    return this.db.any(
      `SELECT id, okrug, district, adress, terms_reason as termsReason, type, new_buildings as newBuildings, moves_to as movesTo,
      json_build_object('plan', 
        json_build_object(
          'firstResetlementStart', plan_first_resettlement_start,
          'firstResetlementEnd', plan_first_resettlement_end,
          'secontResetlementEnd', plan_second_resettlement_end,
          'demolitionEnd', plan_demolition_end),
        'actual',
        json_build_object(
          'firstResetlementStart', actual_first_resettlement_start,
          'firstResetlementEnd', actual_first_resettlement_end,
          'secontResetlementEnd', actual_second_resettlement_end,
          'demolitionEnd', actual_demolition_end)
      ) as terms
      FROM renovation.buildings_old_full_view
      ${whereSql} 
      LIMIT ${limit} OFFSET ${offset}`,
    );
  }
}
