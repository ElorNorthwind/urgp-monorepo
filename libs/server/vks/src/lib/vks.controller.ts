import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  QmsQuery,
  qmsQuerySchema,
  VksCase,
  VksCaseDetails,
  VksCasesQuery,
  vksCasesQuerySchema,
  VksTimelinePoint,
  vksUpdateQueryReturnValue,
} from '@urgp/shared/entities';
import { VksService } from './vks.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

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

  @Get('cases/:id/details')
  getVksCaseDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VksCaseDetails> {
    return this.vks.getVksCaseDetails(id);
  }

  @Get('cases')
  getVksCases(
    @Query(new ZodValidationPipe(vksCasesQuerySchema)) q: VksCasesQuery,
  ): Promise<VksCase[]> {
    return this.vks.getVksCases(q);
  }

  @CacheTTL(1000 * 60 * 5)
  @UseInterceptors(CacheInterceptor)
  @Get('classificators/service-types')
  getVksServiceTypeClassificator(): Promise<NestedClassificatorInfoString[]> {
    return this.vks.ReadVksServiceTypeClassificator();
  }

  @CacheTTL(1000 * 60 * 5)
  @UseInterceptors(CacheInterceptor)
  @Get('classificators/departments')
  getVksDepartmentsClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.vks.ReadVksDepartmentClassificator();
  }

  @CacheTTL(1000 * 60 * 5)
  @UseInterceptors(CacheInterceptor)
  @Get('classificators/statuses')
  getVksStatusesClassificator(): Promise<NestedClassificatorInfoString[]> {
    return this.vks.ReadVksStatusClassificator();
  }

  @CacheTTL(1000 * 60 * 30)
  @UseInterceptors(CacheInterceptor)
  @Get('charts/timeline')
  getVksTimeline(): Promise<VksTimelinePoint[]> {
    return this.vks.ReadVksTimeline();
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
