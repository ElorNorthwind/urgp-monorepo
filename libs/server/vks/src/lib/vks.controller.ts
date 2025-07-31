import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { format, startOfYesterday } from 'date-fns';
import { AnketologSurveyTypes } from 'libs/shared/entities/src/vks/config';
import { VksService } from './vks.service';

@Controller('vks')
@UseGuards(AccessTokenGuard)
export class VksController {
  constructor(private readonly vks: VksService) {}

  @Get('qms')
  getQmsBookingReport(): Promise<{
    clients: number;
    records: number;
  }> {
    return this.vks.GetQmsReport({
      dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
      dateTo: format(new Date(), 'dd.MM.yyyy'),
    });
  }

  @Get('anketolog/operator')
  getAnketologOperatorSurvey(): Promise<{ found: number; updated: number }> {
    return this.vks.GetAnketologSurvey({
      surveyId: AnketologSurveyTypes.operator,
      // dateFrom: '01.01.2024',
      dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
      dateTo: format(new Date(), 'dd.MM.yyyy'),
    });
  }

  @Get('anketolog/client')
  getAnketologClientSurvey(): Promise<{ found: number; updated: number }> {
    return this.vks.GetAnketologSurvey({
      surveyId: AnketologSurveyTypes.client,
      // dateFrom: '01.01.2024',
      dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
      dateTo: format(new Date(), 'dd.MM.yyyy'),
    });
  }
}
