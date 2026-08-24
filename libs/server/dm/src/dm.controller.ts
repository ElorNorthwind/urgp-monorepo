import {
  ConflictException,
  Controller,
  Get,
  Logger,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { DmService } from './dm.service';
import { UPDATE_STATES, UpdateStatus } from '@urgp/shared/entities';
import { Observable, map } from 'rxjs';

@Controller('dm')
export class DmController {
  constructor(private readonly dm: DmService) {}

  @Get('health-check')
  HealthCheck(): string {
    return 'server is running';
  }

  @UseGuards(AccessTokenGuard)
  @Get('update/daily')
  UpdateDailyResolutions(): Promise<void> {
    return this.dm.startUpdate();
  }

  @UseGuards(AccessTokenGuard)
  @Get('update/all-undone')
  GetAllUndoneResolutions(): Promise<number> {
    return this.dm.addDmAllUndoneResolutions();
  }

  @UseGuards(AccessTokenGuard)
  @Get('update/suspences')
  GetSuspencesForUndoneDocumens(): Promise<number> {
    return this.dm.updateSuspences();
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
        to: '04.02.2026',
      },
      'SPD',
    );
    // return this.dm.addDmShortTermRecords({
    //   from: '29.01.2025',
    //   to: '01.02.2025',
    // });

    // return this.dm.updateSingleResolution(-787158072);
  }

  @Post('update/manual')
  async StartManualUpdate(): Promise<{ message: string }> {
    if (this.dm.getStatus()?.state === UPDATE_STATES['RUNNING'])
      return { message: 'Обновление уже запущено, дождитесь окончания...' };
    try {
      this.dm.startUpdate();
      return { message: 'Обновление запущено' };
    } catch (error) {
      Logger.log('Ошибка при обновлении данных в документоконтроле', error);
      return { message: 'Ошибка при обновлении данных' };
    }
  }

  @Get('update/status')
  GetUpdateStatus(): UpdateStatus {
    return this.dm.getStatus();
  }

  @Sse('update/stream')
  streamUpdateStatus(): Observable<MessageEvent> {
    return this.dm.getStatusStream().pipe(
      map(
        (status) =>
          ({
            data: status,
          }) as MessageEvent,
      ),
    );
  }
}
