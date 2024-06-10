import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';

@Injectable()
export class RenovationService {
  constructor(private readonly dbServise: DatabaseService) {}

  public getOldHousesGeoJson() {
    return this.dbServise.db.renovation.oldBuildingsGeoJson();
  }
}
