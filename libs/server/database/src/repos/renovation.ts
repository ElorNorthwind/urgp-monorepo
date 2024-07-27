import { IDatabase, IMain } from 'pg-promise';
// import path = require('path');
// import pgPromise = require('pg-promise');
import {
  GetOldAppartmentsDto,
  GetOldBuldingsDto,
  OldAppartment,
  OldBuilding,
} from '@urgp/shared/entities';

import { renovation } from './sql/sql';
import { Logger } from '@nestjs/common';
// // Helper for linking to external query files:
// function sql(file: string) {
//   const fullPath = path.join(__dirname, file);
//   return new pgPromise.QueryFile(fullPath, { minify: true });
// }

const oldBuildingsSorting = {
  district: {
    asc: 'o.rank, district, adress',
    desc: 'o.rank DESC, district DESC, adress DESC',
  },
  adress: { asc: 'adress', desc: 'adress DESC' },
  age: {
    asc: 'a.rank, terms=>actual=>>firstResetlementStart, adress',
    desc: 'a.rank DESC, terms=>actual=>>firstResetlementStart DESC, adress',
  },
  status: {
    asc: 'b.status, o.rank, district, adress',
    desc: 'b.status DESC, o.rank, district, adress',
  },
  date: {
    asc: 'terms=>actual=>>firstResetlementStart NULLS LAST, adress',
    desc: 'terms=>actual=>>firstResetlementStart DESC NULLS FIRST, adress',
  },
  total: {
    asc: '"totalApartments", adress',
    desc: '"totalApartments" DESC, adress',
  },
  risk: {
    asc: 'apartments=>deviation=>>risk / "totalApartments", adress',
    desc: 'apartments=>deviation=>>risk / "totalApartments" DESC, adress',
  },
};

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
      okrugs,
      districts,
      relocationType,
      deviation,
      relocationAge,
      relocationStatus,
      adress,
      MFRInvolvment,
      noMFR = false,
      sortingKey,
      sortingDirection = 'asc',
    } = dto;
    const where = [];
    console.log(sortingKey, sortingDirection);
    if (okrugs) {
      where.push(`okrug = ANY(ARRAY['${okrugs.join("','")}'])`);
    }
    if (districts && districts.length > 0) {
      where.push(`district = ANY(ARRAY['${districts.join("','")}'])`);
    }
    if (relocationType && relocationType.length > 0) {
      where.push(
        `"relocationTypeId" = ANY(ARRAY[${relocationType.join(',')}])`,
      );
    }
    if (deviation && deviation.length > 0) {
      where.push(
        `"buildingDeviation" = ANY(ARRAY['${deviation.join("','")}'])`,
      );
    }
    if (relocationAge && relocationAge.length > 0) {
      where.push(
        `"buildingRelocationStartAge" = ANY(ARRAY['${relocationAge.join("','")}'])`,
      );
    }
    if (relocationStatus && relocationStatus.length > 0) {
      where.push(
        `"buildingRelocationStatus" = ANY(ARRAY['${relocationStatus.join("','")}'])`,
      );
    }
    if (adress && adress.length > 0) {
      where.push(`LOWER(adress) LIKE LOWER('%${adress}%')`);
    }
    // Отдельный случай: фильтр должен работать строго при одной выбранной опции
    if (MFRInvolvment && MFRInvolvment.length === 1) {
      where.push(
        `(apartments->'difficulty'->>'mfr')::int ${MFRInvolvment[0] === 'С МФР' ? '>' : '='} 0`,
      );
    }

    const conditions = where.length > 0 ? ` WHERE ${where.join(' AND ')}` : '';
    return this.db.any(renovation.oldBuildings, {
      limit,
      offset,
      conditions,
      view: noMFR
        ? 'renovation.old_buildings_no_mfr'
        : 'renovation.old_buildings_fe',
    });
  }

  // Returns old houses for renovation;
  getOldAppartments(dto: GetOldAppartmentsDto): Promise<OldAppartment[]> {
    const { limit = 500, offset = 0, okrugs, districts, buildingId } = dto;
    const where = [];
    if (okrugs) {
      where.push(`okrug = ANY(ARRAY['${okrugs.join("','")}'])`);
    }
    if (districts && districts.length > 0) {
      where.push(`"district" = ANY(ARRAY['${districts.join("','")}'])`);
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
