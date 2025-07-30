import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { VksService } from './vks.service';
import { format, startOfMonth, startOfYesterday } from 'date-fns';
import {
  AnketologSurveyResponse,
  BookingClient,
  BookingRecord,
  RawBookingRecord,
} from '@urgp/shared/entities';
import { AnketologSurveyTypes } from 'libs/shared/entities/src/vks/config';
import { formatOperatorSurvey } from './util/formatOperatorSurvey';
import { formatClientSurvey } from './util/formatClientSurvey';

@Controller('vks')
@UseGuards(AccessTokenGuard)
export class VksController {
  constructor(private readonly vks: VksService) {}

  @Get('qms')
  getQmsBookingReport(): Promise<{
    clients: BookingClient[];
    records: BookingRecord[];
  }> {
    return this.vks.GetQmsReport({
      dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
      // dateFrom: format(new Date(), 'dd.MM.yyyy'),
      dateTo: format(new Date(), 'dd.MM.yyyy'),
    });
  }

  @Get('anketolog/operator')
  getAnketologOperatorSurvey(): Promise<any[]> {
    return this.vks
      .GetAnketologSurvey({
        surveyId: AnketologSurveyTypes.operator,
        // dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
        dateFrom: '01.04.2025',
        dateTo: format(new Date(), 'dd.MM.yyyy'),
      })
      .then((records: AnketologSurveyResponse[]) =>
        records?.map((r) => formatOperatorSurvey(r)),
      );
  }

  @Get('anketolog/client')
  getAnketologClientSurvey(): Promise<any[]> {
    return this.vks
      .GetAnketologSurvey({
        surveyId: AnketologSurveyTypes.client,
        // dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
        dateFrom: '01.04.2025',
        dateTo: format(new Date(), 'dd.MM.yyyy'),
      })
      .then((records: AnketologSurveyResponse[]) =>
        records?.map((r) => formatClientSurvey(r)),
      );
  }
}
