import { Controller, Get, UseGuards } from '@nestjs/common';
import { DataMosService } from './data-mos.service';
import { AccessTokenGuard } from '@urgp/server/auth';

@Controller('data-mos')
@UseGuards(AccessTokenGuard)
export class DataMosController {
  constructor(private readonly dataMos: DataMosService) {}
  @Get('update-address')
  updateAdresses(): Promise<any> {
    return this.dataMos.updateAdresses();
  }
  @Get('calculate-streets')
  calculateStreets(): Promise<any> {
    return this.dataMos.calculateStreets(5000);
  }
}
