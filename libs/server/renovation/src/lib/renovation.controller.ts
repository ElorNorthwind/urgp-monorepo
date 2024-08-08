import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RenovationService } from './renovation.service';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  DoneTimelinePoint,
  getOldAppartments,
  GetOldAppartmentsDto,
  getOldBuldings,
  GetOldBuldingsDto,
  OkrugTotals,
  OldApartmentDetails,
  OldApartmentTimeline,
  OldAppartment,
  OldBuilding,
  RequestWithUserData,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';

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

  @UseGuards(AccessTokenGuard)
  @Get('done-timeline')
  getDoneTimeline(): Promise<DoneTimelinePoint[]> {
    return this.renovation.getDoneTimeline();
  }

  @Get('old-apartment-timeline/:id')
  getOldApartmentTimeline(
    @Param('id') id: number,
  ): Promise<OldApartmentTimeline[]> {
    return this.renovation.getOldApartmentTimeline(id);
  }
  @Get('old-apartment-details/:id')
  getOldApartmentDetails(
    @Param('id') id: number,
  ): Promise<OldApartmentDetails> {
    return this.renovation.getOldApartmentsDetails(id);
  }
}

// @Get(':id')
// findOne(@Param() params: any): string {
//   console.log(params.id);
//   return `This action returns a #${params.id} cat`;
// }
