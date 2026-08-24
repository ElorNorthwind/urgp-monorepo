import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Logger,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  Sse,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  defineVksAbilityFor,
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  QmsQuery,
  qmsQuerySchema,
  RequestWithUserData,
  UPDATE_STATES,
  UpdateDgiVksSurveyHousingForm,
  updateDgiVksSurveyHousingFormSchema,
  UpdateStatus,
  VkaSetBooleanFlag,
  vkaSetBooleanFlagSchema,
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
import { Observable, map } from 'rxjs';
import { Response } from 'express';

@Controller('vks')
export class VksController {
  constructor(private readonly vks: VksService) {}

  @Post('update/manual')
  async StartManualUpdate(): Promise<{ message: string }> {
    if (this.vks.getStatus()?.state === UPDATE_STATES['RUNNING'])
      return { message: 'Обновление уже запущено, дождитесь окончания...' };
    try {
      this.vks.startUpdate();
      return { message: 'Обновление запущено' };
    } catch (error) {
      Logger.log('Ошибка при обновлении данных в документоконтроле', error);
      return { message: 'Ошибка при обновлении данных' };
    }
  }

  @Get('update/status')
  GetUpdateStatus(): UpdateStatus {
    return this.vks.getStatus();
  }

  @Sse('update/stream')
  streamUpdateStatus(): Observable<MessageEvent> {
    return this.vks.getStatusStream().pipe(
      map(
        (status) =>
          ({
            data: status,
          }) as MessageEvent,
      ),
    );
  }

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

  // @UseGuards(AccessTokenGuard)
  // @Get('update')
  // async updateSurveyDataDaily(): Promise<string> {
  //   try {
  //     this.vks.cronUpdateSurveyData(true);
  //     return 'Daily update started';
  //   } catch (e) {
  //     return 'Failed to start daily update';
  //   }
  // }

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

  @UseGuards(AccessTokenGuard)
  @Post('cases/is-technical')
  setVksCaseIsTechnical(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(vkaSetBooleanFlagSchema)) q: VkaSetBooleanFlag,
  ): Promise<boolean | null> {
    const i = defineVksAbilityFor(req.user);
    if (i.cannot('update', 'VksCase'))
      throw new BadRequestException('Нет прав на редактирование оценки');
    return this.vks.setIsTechnical(q);
  }

  @UseGuards(AccessTokenGuard)
  @Post('cases/dgi-survey')
  updateVksDgiSurvey(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(updateDgiVksSurveyHousingFormSchema))
    q: UpdateDgiVksSurveyHousingForm,
  ): Promise<void> {
    const i = defineVksAbilityFor(req.user);
    if (i.cannot('update', 'VksCase'))
      throw new BadRequestException('Нет прав на редактирование анкеты');
    return this.vks.updateVksDgiSurvey(q);
  }

  @UseGuards(AccessTokenGuard)
  @Post('cases/sent-to-yandex')
  setVksCaseIsSentToYandex(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(vkaSetBooleanFlagSchema)) q: VkaSetBooleanFlag,
  ): Promise<boolean | null> {
    const i = defineVksAbilityFor(req.user);
    if (i.cannot('update', 'VksCase'))
      throw new BadRequestException('Нет прав на редактирование статуса');
    return this.vks.setIsSentToYandex(q);
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

  @CacheTTL(1000 * 60 * 5)
  @UseInterceptors(CacheInterceptor)
  @Get('classificators/users')
  getVksUsersClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.vks.ReadVksUsersClassificator();
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
      // dateFrom: '23.07.2026',
      dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
      dateTo: format(new Date(), 'dd.MM.yyyy'),
    });
  }

  @Get('anketolog/client')
  getAnketologClientSurvey(): Promise<{ found: number; updated: number }> {
    return this.vks.GetAnketologSurvey({
      surveyId: AnketologSurveyTypes.client,
      // dateFrom: '23.07.2026',
      dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
      dateTo: format(new Date(), 'dd.MM.yyyy'),
    });
  }

  @Get('dm/update/status')
  getDmUpdateStatus(): Promise<UpdateStatus> {
    return this.vks.GetDmUpdateStatus();
  }

  @Get('dm/update/stream')
  async streamDmUpdateStatus(@Res() res: Response, @Headers() headers: any) {
    // 1. Set SSE headers for the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // If your client is on a different origin, you can still set CORS here:
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
      const upstreamStream = await this.vks.GetDmUpdateStream();

      // 4. Pipe the stream to the client response
      upstreamStream.on('data', (chunk) => {
        res.write(chunk);
      });

      upstreamStream.on('end', () => {
        res.end();
        // Logger.log('Stream ended successfully');
      });

      upstreamStream.on('error', (err) => {
        Logger.error('Upstream stream error:', err);
        if (!res.headersSent) {
          res.status(HttpStatus.BAD_GATEWAY).json({
            message: 'Upstream service error',
          });
        } else {
          res.end(); // close the connection if headers were already sent
        }
      });

      // 5. Handle client disconnection – clean up the upstream stream
      res.on('close', () => {
        upstreamStream.destroy();
        // Logger.log('Client disconnected, upstream stream destroyed');
      });
    } catch (error) {
      Logger.error('Failed to connect to upstream:', error);
      if (!res.headersSent) {
        res.status(HttpStatus.BAD_GATEWAY).json({
          message: 'Could not connect to the update service',
        });
      }
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('dm/update/manual')
  launchDmUpdate(): Promise<void> {
    return this.vks.LaunchDmUpdate();
  }
}
