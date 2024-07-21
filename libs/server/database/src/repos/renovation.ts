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
    const {
      limit = 500,
      offset = 0,
      okrug,
      districts,
      relocationType,
      deviation,
      relocationAge,
      relocationStatus,
      adress,
    } = dto;
    const where = [];
    if (okrug) {
      where.push(`okrug = '${okrug}'`);
    }
    if (districts && districts.length > 0) {
      where.push(`district = ANY(ARRAY['${districts.join("','")}'])`);
    }
    if (relocationType && relocationType.length > 0) {
      where.push(`relocationType = ANY(ARRAY[${relocationType.join(',')}])`);
    }
    if (deviation && deviation.length > 0) {
      where.push(`buildingDeviation = ANY(ARRAY['${deviation.join("','")}'])`);
    }
    if (relocationAge && relocationAge.length > 0) {
      where.push(
        `buildingRelocationStartAge = ANY(ARRAY['${relocationAge.join("','")}'])`,
      );
    }
    if (relocationStatus && relocationStatus.length > 0) {
      where.push(
        `buildingRelocationStatus = ANY(ARRAY['${relocationStatus.join("','")}'])`,
      );
    }
    if (adress && adress.length > 0) {
      where.push(`adress LIKE '%${adress}%'`);
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
    const { limit = 500, offset = 0, okrug, districts, buildingId } = dto;
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
