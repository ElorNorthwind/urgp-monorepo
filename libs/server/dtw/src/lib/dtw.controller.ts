import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { DtwService } from './dtw.service';

@Controller('dtw')
// @UseGuards(AccessTokenGuard)
export class DtwController {
  constructor(private readonly dtw: DtwService) {}

  @Get('test')
  getTestDwtLogin(): Promise<any> {
    return this.dtw.DtwLogin();
  }

  // @Get('calculate-streets')
  // calculateStreets(): Promise<any> {
  //   return this.dataMos.calculateStreets(5000);
  // }
}
