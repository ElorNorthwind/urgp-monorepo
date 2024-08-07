import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import { GetOldAppartmentsDto, GetOldBuldingsDto } from '@urgp/shared/entities';

@Injectable()
export class RenovationService {
  constructor(private readonly dbServise: DatabaseService) {}

  public async getOldBuildingsGeoJson() {
    const resp = await this.dbServise.db.renovation.getOldBuildingsGeoJson();
    return resp[0].geojson;
  }

  public async getOldBuildings(dto: GetOldBuldingsDto) {
    return this.dbServise.db.renovation.getOldBuildings(dto);
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
}
