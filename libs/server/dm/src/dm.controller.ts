import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { DmService } from './dm.service';

@Controller('dm')
@UseGuards(AccessTokenGuard)
export class DmController {
  constructor(private readonly dm: DmService) {}

  @Get('update/daily')
  UpdateDailyResolutions(): Promise<number> {
    return this.dm.updateDailyRecords();
  }

  @Get('update/all-undone')
  GetAllUndoneResolutions(): Promise<number> {
    return this.dm.addDmAllUndoneResolutions();
  }
}
