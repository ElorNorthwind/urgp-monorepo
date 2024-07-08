import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { RenovationService } from './renovation.service';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  DbRenovationOldHouse,
  getRenovationOldHouses,
  GetRenovationOldHousesDto,
} from '@urgp/server/database';

@Controller('renovation')
export class RenovationController {
  constructor(private readonly renovation: RenovationService) {}

  @Get('old-geojson')
  getOldGeoJson(): Promise<unknown[]> | unknown[] {
    return this.renovation.getOldHousesGeoJson();
  }

  @Get('old-houses')
  @UsePipes(new ZodValidationPipe(getRenovationOldHouses))
  getOldHouses(
    @Query() getRenovationOldHousesDto: GetRenovationOldHousesDto,
  ): Promise<DbRenovationOldHouse[]> {
    return this.renovation.getOldHouses(getRenovationOldHousesDto);
  }
}
