import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { DmService } from './dm.service';

@Controller('dm')
export class DmController {
  constructor(private readonly dm: DmService) {}

  @Get('health-check')
  HealthCheck(): string {
    return 'server is running';
  }

  @UseGuards(AccessTokenGuard)
  @Get('update/daily')
  UpdateDailyResolutions(): Promise<number> {
    return this.dm.updateDailyRecords();
  }

  @UseGuards(AccessTokenGuard)
  @Get('update/all-undone')
  GetAllUndoneResolutions(): Promise<number> {
    return this.dm.addDmAllUndoneResolutions();
  }

  @UseGuards(AccessTokenGuard)
  @Get('update/all')
  GetAllResolutions(): Promise<number> {
    return this.dm.updateAllResolutions();
  }

  @UseGuards(AccessTokenGuard)
  @Get('test')
  Test(): Promise<number> {
    // return this.dm.updateSingleResolution(-784831733);
    return this.dm.addDmLongTermRecords(
      {
        from: '01.01.2025',
        to: '01.02.2025',
      },
      'SPD',
    );
    // return this.dm.addDmShortTermRecords({
    //   from: '29.01.2025',
    //   to: '01.02.2025',
    // });

    // return this.dm.updateSingleResolution(-787158072);
  }
}
