import { IDatabase, IMain } from 'pg-promise';
// import path = require('path');
// import pgPromise = require('pg-promise');
import {
  ApartmentCapstone,
  ApartmentDefect,
  ApartmentDefectData,
  ApproveStageDto,
  BuildingRelocationMapElement,
  BuildingsGeoJSON,
  CityAgeDiffuculty,
  CityTotalAgeInfo,
  CityTotalDeviations,
  ConnectedPlots,
  CreateManualDateDto,
  CreateMessageDto,
  CreateStageDto,
  DeleteMessageDto,
  DoneByYearInfo,
  DoneTimelinePoint,
  ExtendedMessage,
  ExtendedStage,
  ManualDate,
  Message,
  MessagesUnansweredDto,
  MonthlyDoneInfo,
  MonthlyProgressInfo,
  NestedClassificatorInfo,
  NewBuilding,
  OkrugTotalDeviations,
  OkrugTotals,
  OldApartmentDetails,
  OldApartmentTimeline,
  OldAppartment,
  OldBuilding,
  OldBuildingConnectionsInfo,
  OldBuildingsStartAndFinish,
  PendingStage,
  ProblematicApartmentInfo,
  ReadApartmentMessageDto,
  ReadMessageByIdDto,
  RenovationNewBuilding,
  RenovationNewBuildingDeviationTotals,
  RenovationNewBuildingStatusTotals,
  SankeyData,
  Stage,
  StageApproveStatusData,
  StageGroup,
  StartTimelineInfo,
  UnansweredMessage,
  UpdateMessageDto,
  UpdateStageDto,
  YearlyDoneInfo,
  YearlyProgressInfo,
} from '@urgp/shared/entities';

import { camelToSnakeCase } from '../lib/to-snake-case';
import { renovation } from './sql/sql';

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

  getNewBuildingById(id: number): Promise<NewBuilding | null> {
    return this.db.oneOrNone(renovation.newBuildings, {
      id: id,
    });
  }

  getOldAppartments(): Promise<OldAppartment[]> {
    return this.db.any(renovation.oldApartments);
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

  getCityAgeDifficulties(): Promise<CityAgeDiffuculty[]> {
    return this.db.any(renovation.cityAgeDifficulties);
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
  getYearlyProgressTimeline(): Promise<YearlyProgressInfo[]> {
    return this.db.any(renovation.yearlyProgressTimeline);
  }

  getYearlyDoneTimelime(): Promise<YearlyDoneInfo[]> {
    return this.db.any(renovation.yearlyDoneTimeline);
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

  insertApartmentDefects(records: ApartmentDefectData[]): Promise<null> {
    const defectColumns = [
      { name: 'unom' },
      { name: 'apart_num', prop: 'apartmentNum' },
      { name: 'complaint_date', prop: 'complaintDate', cast: 'date' },
      { name: 'entry_date', prop: 'entryDate', cast: 'date' },
      { name: 'changed_done_date', prop: 'changedDoneDate', cast: 'date' },
      { name: 'actual_done_date', prop: 'actualDoneDate', cast: 'date' },
      { name: 'is_done', prop: 'isDone' },
      { name: 'description' },
      { name: 'url' },
    ];

    // const q = this.pgp.as.format(
    //   renovation.insertApartmentDefects,
    //   this.pgp.helpers.values(records, defectColumns),
    // );

    return this.db.none(
      renovation.insertApartmentDefects,
      this.pgp.helpers.values(records, defectColumns),
    );
  }

  getApartmentDefects(id: number): Promise<ApartmentDefect[]> {
    return this.db.any(renovation.apartmentDefects, { id });
  }

  getPlots(): Promise<RenovationNewBuilding[]> {
    return this.db.any(renovation.plots);
  }

  getPlotsStatusTotals(): Promise<RenovationNewBuildingStatusTotals> {
    return this.db.one(renovation.plotsStatusTotals);
  }

  getPlostDeviationTotals(): Promise<RenovationNewBuildingDeviationTotals[]> {
    return this.db.any(renovation.plotsDeviationTotals);
  }
}
