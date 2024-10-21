import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  CreateMessageDto,
  DeleteMessageDto,
  ExtendedMessage,
  GetOldAppartmentsDto,
  GetOldBuldingsDto,
  Message,
  ReadMessageByIdDto,
  ReadApartmentMessageDto,
  UpdateMessageDto,
  ConnectedPlots,
  CityTotalDeviations,
  UnansweredMessage,
  MessagesUnansweredDto,
  BuildingRelocationMapElement,
  CityTotalAgeInfo,
  StartTimelineInfo,
  DoneByYearInfo,
  ProblematicApartmentInfo,
  OldBuildingConnectionsInfo,
  CreateStageDto,
  Stage,
  UpdateStageDto,
  StageGroup,
  ApproveStageDto,
  StageApproveStatusData,
  PendingStage,
  OldBuildingsStartAndFinish,
  MonthlyProgressInfo,
  MonthlyDoneInfo,
  SankeyData,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';

@Injectable()
export class RenovationService {
  constructor(
    private readonly dbServise: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getOldBuildingsGeoJson() {
    return this.dbServise.db.renovation.getOldBuildingsGeoJson();
  }

  public async getNewBuildingsGeoJson() {
    return this.dbServise.db.renovation.getNewBuildingsGeoJson();
  }

  public async getOldBuildings() {
    return this.dbServise.db.renovation.getOldBuildings();
  }

  public async getOldBuildingById(id: number) {
    return this.dbServise.db.renovation.getOldBuildingById(id);
  }

  public async getNewBuildingById(id: number) {
    return this.dbServise.db.renovation.getNewBuildingById(id);
  }

  public async getOldAppartments(dto: GetOldAppartmentsDto) {
    return this.dbServise.db.renovation.getOldAppartments(dto);
  }
  public async getOkrugTotals() {
    return this.dbServise.db.renovation.getOkrugTotalHouses();
  }
  public async getOkrugTotalDeviations() {
    return this.dbServise.db.renovation.getOkrugTotalDeviations();
  }
  public async getDoneTimeline() {
    return this.dbServise.db.renovation.getDoneTimeline();
  }
  public async getOldApartmentTimeline(id: number) {
    return this.dbServise.db.renovation.getOldApartmentsTimeline(id);
  }
  public async getOldApartmentsDetails(id: number) {
    return this.dbServise.db.renovation.getOldApartmentsDetails(id);
  }
  public async createMessage(dto: CreateMessageDto): Promise<Message> {
    return this.dbServise.db.renovation.createMessage(dto);
  }

  public async readApartmentMessages(
    dto: ReadApartmentMessageDto,
  ): Promise<ExtendedMessage[]> {
    return this.dbServise.db.renovation.readApartmentMessages(dto);
  }

  public async readMessageById(dto: ReadMessageByIdDto): Promise<Message> {
    return this.dbServise.db.renovation.readMessageById(dto);
  }

  public async updateMessage(
    dto: UpdateMessageDto,
    userId: number,
  ): Promise<Message> {
    return this.dbServise.db.renovation.updateMessage(dto, userId);
  }

  public async deleteMessage(
    dto: DeleteMessageDto,
    userId: number,
  ): Promise<boolean> {
    return this.dbServise.db.renovation.deleteMessage(dto, userId);
  }
  public async getConnectedPlots(id: number): Promise<ConnectedPlots[]> {
    return this.dbServise.db.renovation.getConnectedPlots(id);
  }

  public async getCityTotalDeviations(): Promise<{
    result: CityTotalDeviations;
  }> {
    return this.dbServise.db.renovation.getCityTotalDeviations();
  }

  public async getCityTotalAges(): Promise<CityTotalAgeInfo[]> {
    return this.dbServise.db.renovation.getCityTotalAges();
  }

  public async getCityTotalDoneByYear(): Promise<DoneByYearInfo[]> {
    return this.dbServise.db.renovation.getCityTotalDoneByYear();
  }

  public async getCityStartTimeline(): Promise<StartTimelineInfo[]> {
    return this.dbServise.db.renovation.getCityStartTimeline();
  }

  public async getLastUpdatedDate(): Promise<{
    date: Date;
  }> {
    return this.dbServise.db.renovation.getLastUpdatedDate();
  }

  public async getUnansweredMessages(
    user: MessagesUnansweredDto,
  ): Promise<UnansweredMessage[]> {
    return this.dbServise.db.renovation.getUnansweredMessages(user);
  }

  public async getOldBuildingList(): Promise<
    { value: number; label: string }[]
  > {
    return this.dbServise.db.renovation.getOldBuildingList();
  }

  public async getOldBuildingRelocationMap(
    id: number,
  ): Promise<BuildingRelocationMapElement[]> {
    return this.dbServise.db.renovation.getOldBuildingRelocationMap(id);
  }

  public async getNewBuildingRelocationMap(
    id: number,
  ): Promise<BuildingRelocationMapElement[]> {
    return this.dbServise.db.renovation.getNewBuildingRelocationMap(id);
  }

  public async getProblematicApartments(
    id: number,
  ): Promise<ProblematicApartmentInfo[]> {
    return this.dbServise.db.renovation.getProblematicApartments(id);
  }

  public async getOldBuildingConnections(
    id: number,
  ): Promise<OldBuildingConnectionsInfo> {
    return this.dbServise.db.renovation.getOldBuildingConnections(id);
  }

  public async createStage(
    dto: CreateStageDto,
    approveData?: StageApproveStatusData,
  ): Promise<Stage> {
    return this.dbServise.db.renovation.createStage(dto, approveData);
  }

  public async readApartmentStages(dto: ReadApartmentMessageDto) {
    return this.dbServise.db.renovation.readApartmentStages(dto);
  }
  public async updateStage(
    dto: UpdateStageDto,
    userId: number,
  ): Promise<Stage> {
    return this.dbServise.db.renovation.updateStage(dto, userId);
  }

  public async deleteStage(
    dto: DeleteMessageDto,
    userId: number,
  ): Promise<boolean> {
    return this.dbServise.db.renovation.deleteStage(dto, userId);
  }

  public async approveStage(
    dto: ApproveStageDto,
    userId: number,
  ): Promise<Stage> {
    return this.dbServise.db.renovation.approveStage(dto, userId);
  }
  // TODO: move to separate module
  public async resetCache(): Promise<void> {
    await this.cacheManager.reset();
  }

  public async getStageGroups(): Promise<StageGroup[]> {
    return this.dbServise.db.renovation.getStageGroups();
  }
  public async getStageNeedsApproval(id: number): Promise<boolean> {
    return this.dbServise.db.renovation.getStageNeedsApproval(id);
  }

  public async getPendingStages(): Promise<PendingStage[]> {
    return this.dbServise.db.renovation.getPendingStages();
  }

  public async getOldBuildingsStartAndFinishMonthly(): Promise<
    OldBuildingsStartAndFinish[]
  > {
    return this.dbServise.db.renovation.getOldBuildingsStartAndFinishMonthly();
  }

  public async getOldBuildingsStartAndFinishYearly(): Promise<
    OldBuildingsStartAndFinish[]
  > {
    return this.dbServise.db.renovation.getOldBuildingsStartAndFinishYearly();
  }
  public async getMonthlyProgressTimeline(): Promise<MonthlyProgressInfo[]> {
    return this.dbServise.db.renovation.getMonthlyProgressTimeline();
  }
  public async getMonthlyDoneTimelime(): Promise<MonthlyDoneInfo[]> {
    return this.dbServise.db.renovation.getMonthlyDoneTimelime();
  }

  public async getCurrentYearSankey(): Promise<SankeyData> {
    return this.dbServise.db.renovation.getCurrentYearSankey();
  }
}
