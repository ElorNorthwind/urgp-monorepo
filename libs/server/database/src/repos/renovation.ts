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
  MessagesUnansweredDto,
  UnansweredMessage,
  BuildingRelocationMapElement,
  BuildingsGeoJSON,
  NewBuilding,
  CityTotalAgeInfo,
  StartTimelineInfo,
  DoneByYearInfo,
  OkrugTotalDeviations,
  ProblematicApartmentInfo,
  OldBuildingConnectionsInfo,
  CreateStageDto,
  Stage,
  ExtendedStage,
  UpdateStageDto,
  StageGroup,
  StageApproveStatusData,
  ApproveStageDto,
  PendingStage,
  OldBuildingsStartAndFinish,
  MonthlyProgressInfo,
  MonthlyDoneInfo,
  SankeyData,
  ManualDate,
  Classificator,
  NestedClassificatorInfo,
  CreateManualDateDto,
  ApartmentCapstone,
} from '@urgp/shared/entities';

import { renovation } from './sql/sql';
import { toDate } from 'date-fns';
import { Logger } from '@nestjs/common';
import { camelToSnakeCase } from '../lib/to-snake-case';

// import { Logger } from '@nestjs/common';

// // Helper for linking to external query files:
// function sql(file: string) {
//   const fullPath = path.join(__dirname, file);
//   return new pgPromise.QueryFile(fullPath, { minify: true });
// }

// const oldBuildingsSorting: Record<string, Record<string, string>> = {
//   district: {
//     asc: 'o.rank, district, adress',
//     desc: 'o.rank DESC, district DESC, adress DESC',
//   },
//   adress: { asc: 'adress', desc: 'adress DESC' },
//   age: {
//     asc: `a.rank, terms->'actual'->>'firstResetlementStart', adress`,
//     desc: `a.rank DESC, terms->'actual'->>'firstResetlementStart' DESC, adress`,
//   },
//   status: {
//     asc: 's.rank, o.rank, district, adress',
//     desc: 's.rank DESC, o.rank, district, adress',
//   },
//   date: {
//     asc: `COALESCE(terms->'actual'->>'firstResetlementStart', terms->'plan'->>'firstResetlementStart') NULLS LAST, adress`,
//     desc: `COALESCE(terms->'actual'->>'firstResetlementStart', terms->'plan'->>'firstResetlementStart') DESC NULLS LAST, adress`,
//   },
//   total: {
//     asc: 'total_apartments, adress',
//     desc: 'total_apartments DESC, adress',
//   },
//   risk: {
//     asc: `CASE WHEN total_apartments = 0 THEN null ELSE CAST(apartments->'deviationMFR'->>'risk' as decimal) / total_apartments END NULLS LAST,
//           CASE WHEN total_apartments = 0 THEN null ELSE CAST(apartments->'deviationMFR'->>'attention' as decimal) / total_apartments END NULLS LAST,
//           adress`,
//     desc: `CASE WHEN total_apartments = 0 THEN null ELSE CAST(apartments->'deviationMFR'->>'risk' as decimal) / total_apartments END DESC NULLS LAST,
//            CASE WHEN total_apartments = 0 THEN null ELSE CAST(apartments->'deviationMFR'->>'attention' as decimal) / total_apartments END DESC NULLS LAST,
//            adress`,
//   },
// };

// @Injectable()
export class RenovationRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  // Returns geojson of old buildings;
  async getOldBuildingsGeoJson(): Promise<BuildingsGeoJSON> {
    const result = await this.db.one(renovation.oldBuldingsGeoJson);
    return result['geojson'] as BuildingsGeoJSON;
  }

  // Returns geojson of new buildings (plots);
  async getNewBuildingsGeoJson(): Promise<BuildingsGeoJSON> {
    const result = await this.db.one(renovation.newBuildingsGeoJson);
    return result['geojson'] as BuildingsGeoJSON;
  }

  // Returns old houses for renovation;
  getOldBuildings(): Promise<OldBuilding[]> {
    return this.db.any(renovation.oldBuildings);
  }

  // Returns old houses for renovation;
  getOldBuildingById(id: number): Promise<OldBuilding | null> {
    return this.db.oneOrNone(renovation.oldBuildingById, {
      id,
    });
  }

  // Returns old houses for renovation;
  getManualDatesByBuildingId(buildingId: number): Promise<ManualDate[]> {
    return this.db.any(renovation.manualDatesByBuildingId, {
      buildingId,
    });
  }

  // Returns old houses for renovation;
  getNewBuildingById(id: number): Promise<NewBuilding | null> {
    return this.db.oneOrNone(renovation.newBuildings, {
      id: id,
    });
  }

  // Returns old houses for renovation;
  getOldAppartments(dto: GetOldAppartmentsDto): Promise<OldAppartment[]> {
    const {
      limit = 500,
      offset = 0,
      okrugs,
      districts,
      buildingIds,
      fio,
      deviation,
      stage,
    } = dto;
    const where = [];
    if (okrugs) {
      where.push(`okrug = ANY(ARRAY['${okrugs.join("','")}'])`);
    }
    if (districts && districts.length > 0) {
      where.push(`district = ANY(ARRAY['${districts.join("','")}'])`);
    }
    if (buildingIds) {
      where.push(`building_id = ANY(ARRAY[${buildingIds.join(',')}])`);
    }
    if (deviation) {
      where.push(
        `classificator->>'deviation' = ANY(ARRAY['${deviation.join("','")}'])`,
      );
    }
    if (stage) {
      where.push(
        `classificator->>'stageId' = ANY(ARRAY['${stage.join("','")}'])`,
      );
    }
    if (fio && fio.length > 0) {
      where.push(`LOWER(fio) LIKE LOWER('%${fio}%')`);
    }

    const conditions = where.length > 0 ? ` WHERE ${where.join(' AND ')}` : '';

    return this.db.any(renovation.oldApartments, {
      limit,
      offset,
      conditions,
    });
  }
  getSpecialAppartments(): Promise<OldAppartment[]> {
    return this.db.any(renovation.specialApartments);
  }

  getOkrugTotalHouses(): Promise<OkrugTotals[]> {
    return this.db.any(renovation.okrugTotalHouses);
  }

  getOkrugTotalDeviations(): Promise<OkrugTotalDeviations[]> {
    return this.db.any(renovation.okrugTotalDeviations);
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

  getCityTotalAges(): Promise<CityTotalAgeInfo[]> {
    return this.db.any(renovation.cityTotalAges);
  }

  getCityTotalDoneByYear(): Promise<DoneByYearInfo[]> {
    return this.db.any(renovation.cityTotalDoneByYear);
  }

  getCityStartTimeline(): Promise<StartTimelineInfo[]> {
    return this.db.any(renovation.cityStartTimeline);
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
      needsAnswer: dto.needsAnswer || false,
      answerDate: dto.answerDate || null,
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

  updateMessage(dto: UpdateMessageDto, userId: number): Promise<Message> {
    const updatedMessage = {
      id: dto.id,
      authorId: userId,
      messageContent: dto.messageContent,
      validUntil: dto.validUntil || null,
      needsAnswer: dto.needsAnswer || false,
      answerDate: dto.answerDate || null,
    };

    return this.db.one(renovation.messageUpdate, updatedMessage);
  }

  deleteMessage(dto: DeleteMessageDto, userId: number): Promise<boolean> {
    return this.db.one(renovation.messageDelete, { ...dto, authorId: userId });
  }

  getConnectedPlots(id: number): Promise<ConnectedPlots[]> {
    return this.db.any(renovation.connectedPlots, { id });
  }

  getUnansweredMessages(
    user: MessagesUnansweredDto,
  ): Promise<UnansweredMessage[]> {
    if (user === 'boss') {
      return this.db.any(renovation.unansweredMessages, {
        conditions: `AND 'boss' = ANY(u.roles)`,
      });
    } else if (user === 'all') {
      return this.db.any(renovation.unansweredMessages, { conditions: ' ' });
    } else {
      return this.db.any(renovation.unansweredMessages, {
        conditions: `AND m.author_id = ${user}`,
      });
    }
  }

  getOldBuildingList(): Promise<{ value: number; label: string }[]> {
    return this.db.any(renovation.oldBuildingList);
  }

  getOldBuildingRelocationMap(
    id: number,
  ): Promise<BuildingRelocationMapElement[]> {
    return this.db.any(renovation.oldBuildingRelocationMap, { id });
  }

  getNewBuildingRelocationMap(
    id: number,
  ): Promise<BuildingRelocationMapElement[]> {
    return this.db.any(renovation.newBuildingRelocationMap, { id });
  }

  async getProblematicApartments(
    id: number,
  ): Promise<ProblematicApartmentInfo[]> {
    const data = await this.db.oneOrNone(renovation.problematicApartments, {
      id,
    });
    return data?.problematicAparts || [];
  }

  getOldBuildingConnections(
    id: number,
  ): Promise<OldBuildingConnectionsInfo | null> {
    return this.db.oneOrNone(renovation.oldBuildingConnections, { id });
  }
  createStage(
    dto: CreateStageDto,
    approveStatusData?: StageApproveStatusData,
  ): Promise<Stage> {
    const newStage = {
      authorId: dto.authorId,
      apartmentId: dto.apartmentId,
      stageId: dto.stageId,
      docNumber: dto.docNumber || null,
      docDate: dto.docDate || new Date(),
      messageContent: dto.messageContent || null,
      approveStatus: approveStatusData?.approveStatus || 'pending',
      approveDate: approveStatusData?.approveDate || null,
      approveBy: approveStatusData?.approveBy || null,
      approveNotes: approveStatusData?.approveNotes || null,
    };
    // const q = this.pgp.as.format(renovation.stageCreate, newStage);
    // console.log(q);
    return this.db.one(renovation.stageCreate, newStage);
  }
  readApartmentStages(dto: ReadApartmentMessageDto): Promise<ExtendedStage[]> {
    return this.db.any(renovation.stageApartmentRead, {
      apartmentIds: dto.apartmentIds.join(','),
    });
  }
  updateStage(dto: UpdateStageDto, userId: number): Promise<Stage> {
    const updatedStage = {
      id: dto.id,
      authorId: userId,
      messageContent: dto.messageContent,
      stageId: dto.stageId,
      docNumber: dto.docNumber,
      docDate: dto.docDate,
    };
    // const q = this.pgp.as.format(renovation.stageUpdate, updatedStage);
    // console.log(q);
    return this.db.one(renovation.stageUpdate, updatedStage);
  }
  approveStage(dto: ApproveStageDto, userId: number): Promise<Stage> {
    const approvedStage = {
      id: dto.id,
      approveBy: userId,
      approveDate: new Date(),
      approveStatus: dto.approveStatus,
      approveNotes: dto.approveNotes,
    };
    // const q = this.pgp.as.format(renovation.stageUpdate, updatedStage);
    // console.log(q);
    return this.db.one(renovation.stageApprove, approvedStage);
  }

  deleteStage(dto: DeleteMessageDto, userId: number): Promise<boolean> {
    return this.db.one(renovation.stageDelete, { ...dto, authorId: userId });
  }
  getStageGroups(): Promise<StageGroup[]> {
    return this.db.any(renovation.stageGroups);
  }
  getStageNeedsApproval(id: number): Promise<boolean> {
    return this.db.one(renovation.stageNeedsApproval, { id });
  }

  getPendingStages(): Promise<PendingStage[]> {
    return this.db.any(renovation.pendingStages);
  }

  getOldBuildingsStartAndFinishMonthly(): Promise<
    OldBuildingsStartAndFinish[]
  > {
    return this.db.any(renovation.oldBuildingsStartAndFinishMonthly);
  }

  getOldBuildingsStartAndFinishYearly(): Promise<OldBuildingsStartAndFinish[]> {
    return this.db.any(renovation.oldBuildingsStartAndFinishYearly);
  }
  getMonthlyProgressTimeline(): Promise<MonthlyProgressInfo[]> {
    return this.db.any(renovation.monthlyProgressTimeline);
  }

  getMonthlyDoneTimelime(): Promise<MonthlyDoneInfo[]> {
    return this.db.any(renovation.monthlyDoneTimeline);
  }

  getCurrentYearSankey(): Promise<SankeyData> {
    return this.db.one(renovation.currentYearSankey);
  }

  getCurrentYearApartmentsSankey(): Promise<SankeyData> {
    return this.db.one(renovation.currentYearApartmentsSankey);
  }

  getRelocationTypes(): Promise<NestedClassificatorInfo[]> {
    const sql = `
    SELECT     
      'types' as value,
      'Типы переселения' as label,    
      JSONB_AGG(jsonb_build_object(
        'value', id,        
        'label', short_name,
        'fullname', type,
        'category', 'types'
      )) as items
    FROM renovation.dates_buildings_old_types;`;
    return this.db.any(sql);
  }

  createManualDate(dto: CreateManualDateDto): Promise<number> {
    let columns = [
      { name: 'date_type', prop: 'typeId' },
      { name: 'is_manual', prop: 'isManual' },
    ];

    Object.keys(dto)
      .filter((key) => key !== 'typeId')
      .forEach((key) => {
        columns.push({ name: camelToSnakeCase(key), prop: key });
      });
    // Logger.log(columns);
    const datesColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'dates_buildings_old',
        schema: 'renovation',
      },
    });
    const insert = this.pgp.helpers.insert(
      { isManual: true, ...dto },
      datesColumnSet,
    );

    // Logger.debug(insert);
    return this.db
      .one(insert + ' ON CONFLICT DO NOTHING RETURNING id')
      .then((result: any) => {
        return result.id;
      });
  }

  deleteManualDate(id: number): Promise<null> {
    const sql = 'DELETE FROM renovation.dates_buildings_old WHERE id = $1';
    return this.db.none(sql, [id]);
  }

  getApartmentCapstones(id: number): Promise<ApartmentCapstone[]> {
    return this.db.any(renovation.apartmentCapstones, { id });
  }

  getApartmentStageClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(renovation.apartmentStageClassificator);
  }
}
