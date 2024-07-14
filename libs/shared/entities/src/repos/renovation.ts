import { IDatabase, IMain } from 'pg-promise';
import { GetOldBuldingsDto } from '../model/dto/getOldBuildings';
import { OldBuilding } from '../model/types/oldBuildings';
import path = require('path');
import pgPromise = require('pg-promise');
import { GetOldAppartmentsDto } from '../model/dto/getOldAppartments';
import { OldAppartment } from '../model/types/oldAppartments';

// Helper for linking to external query files:
function sql(file: string) {
  const fullPath = path.join(__dirname, file);
  return new pgPromise.QueryFile(fullPath, { minify: true });
}

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
    const sqlOldBuldingsGeoJson = sql('./sql/oldBuildingsGeoJson.sql');
    return this.db.any(sqlOldBuldingsGeoJson);
  }

  // Returns old houses for renovation;
  getOldBuildings(dto: GetOldBuldingsDto): Promise<OldBuilding[]> {
    const { limit = 100, page = 1, okrug, district } = dto;
    const offset = (page - 1) * limit;
    const where = [];
    if (okrug) {
      where.push(`okrug = '${okrug}'`);
    }
    if (district) {
      where.push(`district = '${district}'`);
    }

    const conditions = where.length > 0 ? ` WHERE ${where.join(' AND ')}` : '';
    const sqlOldBuldings = sql('./sql/oldBuildings.sql');
    return this.db.any(sqlOldBuldings, {
      limit,
      offset,
      conditions,
    });
  }

  // Returns old houses for renovation;
  getOldAppartments(dto: GetOldAppartmentsDto): Promise<OldAppartment[]> {
    const { limit = 100, page = 1, okrug, district, buildingId } = dto;
    const offset = (page - 1) * limit;
    const where = [];
    if (okrug) {
      where.push(`okrug = '${okrug}'`);
    }
    if (district) {
      where.push(`district = '${district}'`);
    }
    if (buildingId) {
      where.push(`"oldApartBuildingId" = '${buildingId}'`);
    }

    const conditions = where.length > 0 ? ` WHERE ${where.join(' AND ')}` : '';
    const sqlOldBuldings = sql('./sql/oldAppartments.sql');
    return this.db.any(sqlOldBuldings, {
      limit,
      offset,
      conditions,
    });
  }
}
