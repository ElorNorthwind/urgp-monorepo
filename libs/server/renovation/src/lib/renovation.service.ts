import { Injectable } from '@nestjs/common';
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
  OldBuildingRelocationMapElement,
} from '@urgp/shared/entities';

@Injectable()
export class RenovationService {
  constructor(private readonly dbServise: DatabaseService) {}

  public async getOldBuildingsGeoJson() {
    return this.dbServise.db.renovation.getOldBuildingsGeoJson();
  }

  public async getOldBuildings(dto: GetOldBuldingsDto) {
    return this.dbServise.db.renovation.getOldBuildings(dto);
  }

  public async getOldBuildingById(id: number) {
    return this.dbServise.db.renovation.getOldBuildingById(id);
  }

  public async getOldAppartments(dto: GetOldAppartmentsDto) {
    return this.dbServise.db.renovation.getOldAppartments(dto);
  }
  public async getOkrugTotals() {
    return this.dbServise.db.renovation.getOkrugTotalHouses();
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

  public async updateMessage(dto: UpdateMessageDto): Promise<Message> {
    return this.dbServise.db.renovation.updateMessage(dto);
  }

  public async deleteMessage(dto: DeleteMessageDto): Promise<boolean> {
    return this.dbServise.db.renovation.deleteMessage(dto);
  }
  public async getConnectedPlots(id: number): Promise<ConnectedPlots[]> {
    return this.dbServise.db.renovation.getConnectedPlots(id);
  }

  public async getCityTotalDeviations(): Promise<{
    result: CityTotalDeviations;
  }> {
    return this.dbServise.db.renovation.getCityTotalDeviations();
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
  ): Promise<OldBuildingRelocationMapElement[]> {
    return this.dbServise.db.renovation.getOldBuildingRelocationMap(id);
  }
}
