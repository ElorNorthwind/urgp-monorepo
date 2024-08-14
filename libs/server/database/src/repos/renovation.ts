import { IDatabase, IMain } from 'pg-promise';
// import path = require('path');
// import pgPromise = require('pg-promise');
import {
  CreateMessageDto,
  DeleteMessageDto,
  DoneTimelinePoint,
  ExtendedMessage,
  GetOldAppartmentsDto,
  GetOldBuldingsDto,
  Message,
  OkrugTotals,
  OldApartmentDetails,
  OldApartmentTimeline,
  OldAppartment,
  OldBuilding,
  ReadMessageByIdDto,
  ReadApartmentMessageDto,
  UpdateMessageDto,
  ConnectedPlots,
  CityTotalDeviations,
} from '@urgp/shared/entities';

import { renovation } from './sql/sql';
// import { Logger } from '@nestjs/common';

// // Helper for linking to external query files:
// function sql(file: string) {
//   const fullPath = path.join(__dirname, file);
//   return new pgPromise.QueryFile(fullPath, { minify: true });
// }

const oldBuildingsSorting: Record<string, Record<string, string>> = {
  district: {
    asc: 'o.rank, district, adress',
    desc: 'o.rank DESC, district DESC, adress DESC',
  },
  adress: { asc: 'adress', desc: 'adress DESC' },
  age: {
    asc: `a.rank, terms->'actual'->>'firstResetlementStart', adress`,
    desc: `a.rank DESC, terms->'actual'->>'firstResetlementStart' DESC, adress`,
  },
  status: {
    asc: 's.rank, o.rank, district, adress',
    desc: 's.rank DESC, o.rank, district, adress',
  },
  date: {
    asc: `COALESCE(terms->'actual'->>'firstResetlementStart', terms->'plan'->>'firstResetlementStart') NULLS LAST, adress`,
    desc: `COALESCE(terms->'actual'->>'firstResetlementStart', terms->'plan'->>'firstResetlementStart') DESC NULLS LAST, adress`,
  },
  total: {
    asc: 'total_apartments, adress',
    desc: 'total_apartments DESC, adress',
  },
  risk: {
    asc: `CASE WHEN total_apartments = 0 THEN null ELSE CAST(apartments->'deviationMFR'->>'risk' as decimal) / total_apartments END NULLS LAST, 
          CASE WHEN total_apartments = 0 THEN null ELSE CAST(apartments->'deviationMFR'->>'attention' as decimal) / total_apartments END NULLS LAST, 
          adress`,
    desc: `CASE WHEN total_apartments = 0 THEN null ELSE CAST(apartments->'deviationMFR'->>'risk' as decimal) / total_apartments END DESC NULLS LAST, 
           CASE WHEN total_apartments = 0 THEN null ELSE CAST(apartments->'deviationMFR'->>'attention' as decimal) / total_apartments END DESC NULLS LAST,
           adress`,
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
      // MFRInvolvment,
      // noMFR = false,
      sortingKey,
      sortingDirection = 'asc',
    } = dto;
    const where = [];

    const ordering = sortingKey
      ? oldBuildingsSorting?.[sortingKey as string]?.[
          sortingDirection as string
        ] || 'o.rank, district, adress'
      : 'o.rank, district, adress';

    if (okrugs) {
      where.push(`okrug = ANY(ARRAY['${okrugs.join("','")}'])`);
    }
    if (districts && districts.length > 0) {
      where.push(`district = ANY(ARRAY['${districts.join("','")}'])`);
    }
    if (relocationType && relocationType.length > 0) {
      where.push(
        `relocation_type_id = ANY(ARRAY[${relocationType.join(',')}])`,
      );
    }
    if (deviation && deviation.length > 0) {
      where.push(`building_deviation = ANY(ARRAY['${deviation.join("','")}'])`);
    }
    if (relocationAge && relocationAge.length > 0) {
      where.push(`relocation_age = ANY(ARRAY['${relocationAge.join("','")}'])`);
    }
    if (relocationStatus && relocationStatus.length > 0) {
      where.push(
        `relocation_status = ANY(ARRAY['${relocationStatus.join("','")}'])`,
      );
    }
    if (adress && adress.length > 0) {
      where.push(`LOWER(adress) LIKE LOWER('%${adress}%')`);
    }
    // // Отдельный случай: фильтр должен работать строго при одной выбранной опции
    // if (MFRInvolvment && MFRInvolvment.length === 1) {
    //   where.push(
    //     `(apartments->'difficulty'->>'mfr')::int ${MFRInvolvment[0] === 'С МФР' ? '>' : '='} 0`,
    //   );
    // }

    const conditions = where.length > 0 ? ` WHERE ${where.join(' AND ')}` : '';
    return this.db.any(renovation.oldBuildings, {
      limit,
      offset,
      conditions,
      ordering,
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

  getOkrugTotalHouses(): Promise<OkrugTotals[]> {
    return this.db.any(renovation.okrugTotalHouses);
  }

  getDoneTimeline(): Promise<DoneTimelinePoint[]> {
    return this.db.any(renovation.doneTimeline);
  }

  getLastUpdatedDate(): Promise<{
    date: Date;
  }> {
    return this.db.one(renovation.lastUpdated);
  }
  getCityTotalDeviations(): Promise<{ result: CityTotalDeviations }> {
    return this.db.one(renovation.cityTotalDeviations);
  }

  getOldApartmentsTimeline(id: number): Promise<OldApartmentTimeline[]> {
    return this.db.any(renovation.oldApartmentTimeline, { id });
  }
  getOldApartmentsDetails(id: number): Promise<OldApartmentDetails> {
    return this.db.one(renovation.oldApartmentDetails, { id });
  }

  createMessage(dto: CreateMessageDto): Promise<Message> {
    const newMessage = {
      authorId: dto.authorId,
      apartmentId: dto.apartmentId || null,
      buildingId: dto.buildingId || null,
      messageContent: dto.messageContent,
      validUntil: dto.validUntil || null,
    };

    return this.db.one(renovation.messageCreate, newMessage);
  }

  readApartmentMessages(
    dto: ReadApartmentMessageDto,
  ): Promise<ExtendedMessage[]> {
    // const q = this.pgp.as.format(renovation.messageApartmentRead, {
    //   apartmentIds: dto.apartmentIds.join(','),
    // });
    // console.log(q);
    return this.db.any(renovation.messageApartmentRead, {
      apartmentIds: dto.apartmentIds.join(','),
    });
  }

  readMessageById(dto: ReadMessageByIdDto): Promise<Message> {
    return this.db.one(renovation.messageByIdRead, dto);
  }

  updateMessage(dto: UpdateMessageDto): Promise<Message> {
    return this.db.one(renovation.messageUpdate, dto);
  }

  deleteMessage(dto: DeleteMessageDto): Promise<boolean> {
    return this.db.one(renovation.messageDelete, dto);
  }
  getConnectedPlots(id: number): Promise<ConnectedPlots[]> {
    return this.db.any(renovation.connectedPlots, { id });
  }
}
