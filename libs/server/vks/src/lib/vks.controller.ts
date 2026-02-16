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
  Req,
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
  RequestWithUserData,
  VkaSetIsTechnical,
  vkaSetIsTechnicalSchema,
  VksCase,
  VksCaseDetails,
  VksCasesQuery,
  vksCasesQuerySchema,
  VksDailySlotStats,
  VksDashbordPageSearch,
  vksDashbordPageSearchSchema,
  VksDepartmentStat,
  VksServiceStat,
  VksStatusStat,
  VksTimelinePoint,
  vksUpdateQueryReturnValue,
  VksUserStats,
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
  async updateSurveyData(
    @Body(new ZodValidationPipe(qmsQuerySchema))
    q: QmsQuery,
  ): Promise<vksUpdateQueryReturnValue> {
    const returnValue = await this.vks.updateSurveyData(q);
    await this.vks.addEmptyVksSlots(q);
    return returnValue;
  }

  @UseGuards(AccessTokenGuard)
  @Get('update')
  async updateSurveyDataDaily(): Promise<string> {
    try {
      this.vks.cronUpdateSurveyData(true);
      return 'Daily update started';
    } catch (e) {
      return 'Failed to start daily update';
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('cases/:id/details')
  getVksCaseDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VksCaseDetails> {
    return this.vks.getVksCaseDetails(id, true);
  }

  @Get('public/cases/:id/details')
  getPublicVksCaseDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VksCaseDetails> {
    return this.vks.getVksCaseDetails(id, false);
  }

  @UseGuards(AccessTokenGuard)
  @Get('cases/:id')
  getVksCaseById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VksCase | null> {
    return this.vks.getVksCaseById(id, true);
  }

  @UseGuards(AccessTokenGuard)
  @Get('public/cases/:id')
  getPublicVksCaseById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VksCase | null> {
    return this.vks.getVksCaseById(id, false);
  }

  @Post('cases/is-technical')
  setVksCaseIsTechnical(
    @Body(new ZodValidationPipe(vkaSetIsTechnicalSchema)) q: VkaSetIsTechnical,
  ): Promise<boolean | null> {
    return this.vks.setIsTechnical(q);
  }

  @UseGuards(AccessTokenGuard)
  @Get('cases')
  getVksCases(
    @Req() req: RequestWithUserData,
    @Query(new ZodValidationPipe(vksCasesQuerySchema)) q: VksCasesQuery,
  ): Promise<VksCase[]> {
    return this.vks.getVksCases(q, true);
  }

  @Get('public/cases')
  getPublicVksCases(
    @Req() req: RequestWithUserData,
    @Query(new ZodValidationPipe(vksCasesQuerySchema)) q: VksCasesQuery,
  ): Promise<VksCase[]> {
    return this.vks.getVksCases(q, false);
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

  @UsePipes(new ZodValidationPipe(vksDashbordPageSearchSchema))
  @Get('charts/status')
  getVksStatusStats(
    @Query()
    q?: VksDashbordPageSearch,
  ): Promise<VksStatusStat[]> {
    if (!q) throw new BadRequestException('Не указаны данные запроса');
    return this.vks.ReadVksStatusStats(q);
  }

  @UsePipes(new ZodValidationPipe(vksDashbordPageSearchSchema))
  @Get('charts/department')
  getVksDepartmentStats(
    @Query()
    q?: VksDashbordPageSearch,
  ): Promise<VksDepartmentStat[]> {
    if (!q) throw new BadRequestException('Не указаны данные запроса');
    return this.vks.ReadVksDepartmentStats(q);
  }

  @UsePipes(new ZodValidationPipe(vksDashbordPageSearchSchema))
  @Get('charts/daily-slots')
  getVksDailySlotStats(
    @Query()
    q?: VksDashbordPageSearch,
  ): Promise<VksDailySlotStats[]> {
    if (!q) throw new BadRequestException('Не указаны данные запроса');
    return this.vks.ReadVksDailySlotStats(q);
  }

  @UsePipes(new ZodValidationPipe(vksDashbordPageSearchSchema))
  @Get('charts/user-stats')
  getVksUserStats(
    @Query()
    q?: VksDashbordPageSearch,
  ): Promise<VksUserStats[]> {
    if (!q) throw new BadRequestException('Не указаны данные запроса');
    return this.vks.ReadVksUserStats(q);
  }

  @UsePipes(new ZodValidationPipe(vksDashbordPageSearchSchema))
  @Get('charts/service')
  getVksServiceStats(
    @Query()
    q?: VksDashbordPageSearch,
  ): Promise<VksServiceStat[]> {
    if (!q) throw new BadRequestException('Не указаны данные запроса');
    return this.vks.ReadVksServiceStats(q);
  }

  @Get('qms/test')
  getQmsBookingReportTest(): Promise<{
    clients: number;
    records: number;
  }> {
    return this.vks.GetQmsReport({
      dateFrom: '06.02.2026',
      dateTo: '09.02.2026',
    });
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
