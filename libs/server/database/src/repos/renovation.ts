import { IDatabase, IMain } from 'pg-promise';
import path = require('path');
import pgPromise = require('pg-promise');
import {
  GetOldAppartmentsDto,
  GetOldBuldingsDto,
  OldAppartment,
  OldBuilding,
} from '@urgp/shared/entities';

import { renovation } from './sql/sql';
// // Helper for linking to external query files:
// function sql(file: string) {
//   const fullPath = path.join(__dirname, file);
//   return new pgPromise.QueryFile(fullPath, { minify: true });
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type geodata = { geojson: any };

// @Injectable()
export class RenovationRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  // Returns geojson of old buildings;
  getOldBuildingsGeoJson(): Promise<geodata[]> {
    return this.db.any(renovation.getOldBuldingsGeoJson);
  }

  // Returns old houses for renovation;
  getOldBuildings(dto: GetOldBuldingsDto): Promise<OldBuilding[]> {
    const { limit = 100, offset = 0, okrug, districts } = dto;
    const where = [];
    if (okrug) {
      where.push(`okrug = '${okrug}'`);
    }
    if (districts && districts.length > 0) {
      where.push(`district = ANY(ARRAY['${districts.join("','")}'])`);
    }

    const conditions = where.length > 0 ? ` WHERE ${where.join(' AND ')}` : '';
    return this.db.any(renovation.oldBuildings, {
      limit,
      offset,
      conditions,
    });
  }

  // Returns old houses for renovation;
  getOldAppartments(dto: GetOldAppartmentsDto): Promise<OldAppartment[]> {
    const { limit = 100, offset = 0, okrug, districts, buildingId } = dto;
    const where = [];
    if (okrug) {
      where.push(`okrug = '${okrug}'`);
    }
    if (districts && districts.length > 0) {
      where.push(`district = ANY(ARRAY['${districts.join("','")}'])`);
    }
    if (buildingId) {
      where.push(`"oldApartBuildingId" = '${buildingId}'`);
    }

    const conditions = where.length > 0 ? ` WHERE ${where.join(' AND ')}` : '';
    return this.db.any(renovation.oldApartments, {
      limit,
      offset,
      conditions,
    });
  }
}
