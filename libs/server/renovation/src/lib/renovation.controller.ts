import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { RenovationService } from './renovation.service';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  DoneTimelinePoint,
  getOldAppartments,
  GetOldAppartmentsDto,
  getOldBuldings,
  GetOldBuldingsDto,
  OkrugTotals,
  OldAppartment,
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
    @Query() getOldHousesDto: GetOldBuldingsDto,
  ): Promise<OldBuilding[]> {
    return this.renovation.getOldBuildings(getOldHousesDto);
  }

  @Get('old-apartments')
  @UsePipes(new ZodValidationPipe(getOldAppartments))
  getOldAppartments(
    @Query() getOldAppartmentsDto: GetOldAppartmentsDto,
  ): Promise<OldAppartment[]> {
    return this.renovation.getOldAppartments(getOldAppartmentsDto);
  }

  @Get('okrug-totals')
  getOkrugTotals(): Promise<OkrugTotals[]> {
    return this.renovation.getOkrugTotals();
  }

  @Get('done-timeline')
  getDoneTimeline(): Promise<DoneTimelinePoint[]> {
    return this.renovation.getDoneTimeline();
  }
}
