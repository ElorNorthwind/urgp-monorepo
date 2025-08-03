import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  QmsQuery,
  qmsQuerySchema,
  VksCase,
  VksCasesQuery,
  vksCasesQuerySchema,
  vksUpdateQueryReturnValue,
} from '@urgp/shared/entities';
import { VksService } from './vks.service';

@Controller('vks')
export class VksController {
  constructor(private readonly vks: VksService) {}

  @UseGuards(AccessTokenGuard)
  @Post('update')
  updateSurveyData(
    @Body(new ZodValidationPipe(qmsQuerySchema))
    q: QmsQuery,
  ): Promise<vksUpdateQueryReturnValue> {
    return this.vks.updateSurveyData(q);
  }

  @Get('cases')
  getVksCases(
    @Query(new ZodValidationPipe(vksCasesQuerySchema)) q: VksCasesQuery,
  ): Promise<VksCase[]> {
    return this.vks.getVksCases(q);
  }

  // @Get('qms')
  // getQmsBookingReport(): Promise<{
  //   clients: number;
  //   records: number;
  // }> {
  //   return this.vks.GetQmsReport({
  //     // dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
  //     dateFrom: '01.01.2024',
  //     dateTo: format(new Date(), 'dd.MM.yyyy'),
  //   });
  // }

  // @Get('anketolog/operator')
  // getAnketologOperatorSurvey(): Promise<{ found: number; updated: number }> {
  //   return this.vks.GetAnketologSurvey({
  //     surveyId: AnketologSurveyTypes.operator,
  //     // dateFrom: '01.01.2024',
  //     dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
  //     dateTo: format(new Date(), 'dd.MM.yyyy'),
  //   });
  // }

  // @Get('anketolog/client')
  // getAnketologClientSurvey(): Promise<{ found: number; updated: number }> {
  //   return this.vks.GetAnketologSurvey({
  //     surveyId: AnketologSurveyTypes.client,
  //     // dateFrom: '01.01.2024',
  //     dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
  //     dateTo: format(new Date(), 'dd.MM.yyyy'),
  //   });
  // }
}
