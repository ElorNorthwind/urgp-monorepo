import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { RenovationService } from './renovation.service';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  getOldBuldings,
  GetOldBuldingsDto,
  OldBuilding,
} from '@urgp/shared/entities';

@Controller('renovation')
export class RenovationController {
  constructor(private readonly renovation: RenovationService) {}

  @Get('old-geojson')
  getOldGeoJson(): Promise<unknown[]> | unknown[] {
    return this.renovation.getOldBuildingsGeoJson();
  }

  @Get('old-buildings')
  @UsePipes(new ZodValidationPipe(getOldBuldings))
  getOldBuldings(
    @Query() getRenovationOldHousesDto: GetOldBuldingsDto,
  ): Promise<OldBuilding[]> {
    return this.renovation.getOldBuildings(getRenovationOldHousesDto);
  }
}
