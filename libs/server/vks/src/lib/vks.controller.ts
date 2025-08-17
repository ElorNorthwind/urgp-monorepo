import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  QmsQuery,
  qmsQuerySchema,
  VkaSetIsTechnical,
  vkaSetIsTechnicalSchema,
  VksCase,
  VksCaseDetails,
  VksCasesQuery,
  vksCasesQuerySchema,
  VksDashbordPageSearch,
  vksDashbordPageSearchSchema,
  VksDepartmentStat,
  VksServiceStat,
  VksStatusStat,
  VksTimelinePoint,
  vksUpdateQueryReturnValue,
} from '@urgp/shared/entities';
import { VksService } from './vks.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { format, startOfYesterday } from 'date-fns';
import { AnketologSurveyTypes } from 'libs/shared/entities/src/vks/config';

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

  @Get('cases/:id')
  getVksCaseById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VksCase | null> {
    return this.vks.getVksCaseById(id);
  }

  @Post('cases/is-technical')
  setVksCaseIsTechnical(
    @Body(new ZodValidationPipe(vkaSetIsTechnicalSchema)) q: VkaSetIsTechnical,
  ): Promise<boolean | null> {
    return this.vks.setIsTechnical(q);
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
  getVksTimeline(
    @Query(
      'departmentIds',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    departmentIds?: number[],
  ): Promise<VksTimelinePoint[]> {
    return this.vks.ReadVksTimeline(departmentIds);
  }

  @CacheTTL(1000 * 60 * 30)
  @UseInterceptors(CacheInterceptor)
  @UsePipes(new ZodValidationPipe(vksDashbordPageSearchSchema))
  @Get('charts/status')
  getVksStatusStats(
    @Query()
    q?: VksDashbordPageSearch,
  ): Promise<VksStatusStat[]> {
    if (!q) throw new BadRequestException('Не указаны данные запроса');
    return this.vks.ReadVksStatusStats(q);
  }

  @CacheTTL(1000 * 60 * 30)
  @UseInterceptors(CacheInterceptor)
  @UsePipes(new ZodValidationPipe(vksDashbordPageSearchSchema))
  @Get('charts/department')
  getVksDepartmentStats(
    @Query()
    q?: VksDashbordPageSearch,
  ): Promise<VksDepartmentStat[]> {
    if (!q) throw new BadRequestException('Не указаны данные запроса');
    return this.vks.ReadVksDepartmentStats(q);
  }

  @CacheTTL(1000 * 60 * 30)
  @UseInterceptors(CacheInterceptor)
  @UsePipes(new ZodValidationPipe(vksDashbordPageSearchSchema))
  @Get('charts/service')
  getVksServiceStats(
    @Query()
    q?: VksDashbordPageSearch,
  ): Promise<VksServiceStat[]> {
    if (!q) throw new BadRequestException('Не указаны данные запроса');
    return this.vks.ReadVksServiceStats(q);
  }

  @Get('qms')
  getQmsBookingReport(): Promise<{
    clients: number;
    records: number;
  }> {
    return this.vks.GetQmsReport({
      dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
      // dateFrom: '01.01.2024',
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
