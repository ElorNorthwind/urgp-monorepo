import { Injectable } from '@nestjs/common';
import {
  DatabaseService,
  GetRenovationOldHousesDto,
} from '@urgp/server/database';

@Injectable()
export class RenovationService {
  constructor(private readonly dbServise: DatabaseService) {}

  public async getOldHousesGeoJson() {
    const resp = await this.dbServise.db.renovation.oldBuildingsGeoJson();
    return resp[0].geojson;
  }

  public async getOldHouses(dto: GetRenovationOldHousesDto) {
    return this.dbServise.db.renovation.getOldHouses(dto);
  }
}
