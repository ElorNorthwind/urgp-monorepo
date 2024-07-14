import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import { GetOldBuldingsDto } from '@urgp/shared/entities';

@Injectable()
export class RenovationService {
  constructor(private readonly dbServise: DatabaseService) {}

  public async getOldHousesGeoJson() {
    const resp = await this.dbServise.db.renovation.oldBuildingsGeoJson();
    return resp[0].geojson;
  }

  public async getOldHouses(dto: GetOldBuldingsDto) {
    return this.dbServise.db.renovation.getOldHouses(dto);
  }
}
