import { Controller, Get } from '@nestjs/common';
import { RenovationService } from './renovation.service';

@Controller('renovation')
export class RenovationController {
  constructor(private readonly renovation: RenovationService) {}

  @Get('old-geojson')
  getOldGeoJson(): Promise<unknown[]> | unknown[] {
    return this.renovation.getOldHousesGeoJson();
  }
}
