import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import {
  AnketologQuery,
  BookingClient,
  ClientSurveyResponse,
  OperatorSurveyResponse,
  QmsQuery,
  RawBookingRecord,
  vksUpdateQueryReturnValue,
  VksCase,
  VksCasesQuery,
  VksCaseDetails,
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  VksTimelinePoint,
  VksDashbordPageSearch,
  VksDepartmentStat,
  VksServiceStat,
  VksStatusStat,
  VkaSetIsTechnical,
} from '@urgp/shared/entities';
import { AxiosRequestConfig } from 'axios';
import { AnketologSurveyTypes } from 'libs/shared/entities/src/vks/config';
import {
  concatMap,
  firstValueFrom,
  from,
  lastValueFrom,
  map,
  retry,
} from 'rxjs';
import * as XLSX from 'xlsx';
import { ANKETOLOG_HTTP_OPTIONS, QMS_HTTP_OPTIONS } from '../config/constants';
import { formatBookingClient } from './util/formatBookingClient';
import { formatBookingRecord } from './util/formatBookingRecord';
import { formatSurvey } from './util/fotmatSurvey';
import { Cron } from '@nestjs/schedule';
import { format, startOfYesterday } from 'date-fns';

@Injectable()
export class VksService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly axios: HttpService,
    private configService: ConfigService,
  ) {}

  public async getVksCases(q: VksCasesQuery): Promise<VksCase[]> {
    return this.dbServise.db.vks.getVksCases(q);
  }

  public async getVksCaseById(caseId: number): Promise<VksCase | null> {
    return this.dbServise.db.vks.getVksCaseById(caseId);
  }

  public async getVksCaseDetails(id: number): Promise<VksCaseDetails> {
    return this.dbServise.db.vks.getVksCaseDetailes(id);
  }

  private async getKnownServiceIds(): Promise<number[]> {
    return this.dbServise.db.vks.getKnownServiceIds();
  }

  public async setIsTechnical(q: VkaSetIsTechnical): Promise<boolean | null> {
    return this.dbServise.db.vks.setIsTechnical(q);
  }

  private async insertNewService(id: number, fullName: string): Promise<null> {
    return this.dbServise.db.vks.insertNewService(id, fullName);
  }

  public async GetQmsReport(
    q: QmsQuery,
  ): Promise<{ clients: number; records: number }> {
    const authHeader = this.configService.get<string>('QMS_AUTH_HEADER');
    if (!authHeader) {
      throw new HttpException(
        'QMS auth data not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    const reportTemplate =
      this.configService.get<string>('QMS_REPORT_TEMPLATE_ID') || 37;
    const dateRangeInputId =
      this.configService.get<string>('QMS_DATE_RANGE_INPUT_ID') || 226;
    const departmentInputId =
      this.configService.get<string>('QMS_DEPARTMENT_INPUT_ID') || 228;
    const departmentValue =
      this.configService.get<string>('QMS_DEPARTMENT_VALUE') ||
      '^Д^е^п^а^р^т^а^м^е^н^т ^г^о^р^о^д^с^к^о^г^о ^и^м^у^щ^е^с^т^в^а ^г^о^р^о^д^а ^М^о^с^к^в^ы';

    const reportId = await firstValueFrom(
      this.axios
        .request({
          ...QMS_HTTP_OPTIONS,
          method: 'post',
          url: '/create/' + reportTemplate,
          headers: {
            contentType: 'application/json',
            Authorization: authHeader,
          },
        })
        .pipe(
          retry(1),
          map((res) => res?.data?.data?.id),
        ),
    );

    Logger.log('Creating QMS report with id: ' + reportId);

    const saveSearchParamConfit: AxiosRequestConfig = {
      ...QMS_HTTP_OPTIONS,
      method: 'post',
      url: '/report/parameters/save',
      headers: { contentType: 'application/json', Authorization: authHeader },
    };

    const buildReportConfig: AxiosRequestConfig = {
      ...QMS_HTTP_OPTIONS,
      method: 'put',
      url: `/report/${reportId}/build/`,
      headers: { contentType: 'application/json', Authorization: authHeader },
    };

    const getReportXlsConfig: AxiosRequestConfig = {
      ...QMS_HTTP_OPTIONS,
      method: 'get',
      headers: { Authorization: authHeader },
      url: `/report/${reportId}/export/format/XLS/`,
      responseType: 'arraybuffer',
    };

    const dateRangeData = {
      id: reportId,
      inputId: dateRangeInputId,
      params: [
        { id: null, feature: 'first', value: q.dateFrom, customData: true },
        { id: null, feature: 'last', value: q.dateTo, customData: true },
      ],
    };

    const departmentData = {
      id: reportId,
      inputId: departmentInputId,
      params: [
        {
          id: '539',
          feature: null,
          value: departmentValue,
          customData: false,
        },
      ],
    };

    await lastValueFrom(
      from([
        { ...saveSearchParamConfit, data: dateRangeData },
        { ...saveSearchParamConfit, data: departmentData },
        { ...buildReportConfig, data: '' },
      ]).pipe(concatMap((config) => this.axios.request(config))),
    );

    const wb = await firstValueFrom(
      this.axios.request(getReportXlsConfig).pipe(
        retry(1),
        map((res) => XLSX.read(new Uint8Array(res?.data), { type: 'array' })),
      ),
    );

    const ws = wb?.Sheets?.[wb?.SheetNames?.[0]];

    const closeReport = await firstValueFrom(
      this.axios
        .request({
          ...QMS_HTTP_OPTIONS,
          method: 'delete',
          headers: {
            contentType: 'application/json',
            Authorization: authHeader,
          },
          url: `/session/close/${reportId}/`,
        })
        .pipe(retry(1)),
    );

    if (closeReport?.data?.status !== 'OK') {
      throw new HttpException(closeReport?.data?.error, HttpStatus.BAD_REQUEST);
    }

    const rawData: RawBookingRecord[] = XLSX.utils.sheet_to_json(ws, {
      range: 1,
    });

    const knownServiceIds = await this.getKnownServiceIds();

    const Clients = new Map<number, BookingClient>();
    const records = rawData
      .filter((r: RawBookingRecord) => r?.['Код бронирования']?.length > 1)
      .map(async (r: RawBookingRecord) => {
        if (!knownServiceIds.includes(parseInt(r?.['id услуги']))) {
          await this.insertNewService(
            parseInt(r?.['id услуги']),
            r?.['Услуга'],
          );
        }
        const formatted = formatBookingRecord(r);
        Clients.set(formatted.clientId, formatBookingClient(r));
        return formatted;
      });

    const clientsCount =
      Clients.size > 0
        ? await this.dbServise.db.vks.insertClients(
            Array.from(Clients.values()),
          )
        : 0;

    const recordCount =
      records?.length > 0
        ? await this.dbServise.db.vks.insertCases(await Promise.all(records))
        : 0;

    return { clients: clientsCount, records: recordCount };
  }

  public async GetAnketologSurvey(
    q: AnketologQuery,
  ): Promise<{ found: number; updated: number }> {
    const apiToken = this.configService.get<string>('ANKETOLOG_API_TOKEN');
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';

    if (!apiToken) {
      throw new HttpException(
        'Anketolog api token not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const postSurveyCongig: AxiosRequestConfig = {
      ...ANKETOLOG_HTTP_OPTIONS,
      method: 'post',
      url: '/survey/report/detail',
      headers: { 'X-Anketolog-ApiKey': apiToken },
    };

    const surveyParams = {
      survey_id: q.surveyId,
      date_from: q.dateFrom,
      date_to: q.dateTo,
    };

    const data = await firstValueFrom(
      this.axios
        .request({
          ...postSurveyCongig,
          data: {
            survey_id: q.surveyId,
            date_from: q.dateFrom,
            date_to: q.dateTo,
          },
        })
        .pipe(
          retry(1),
          map((res) => res?.data),
        ),
    );

    const totalCount = data?.answer_count || 0;

    if (!totalCount || data?.answers?.length === 0) {
      return { found: 0, updated: 0 };
    }

    let collectedCount = 0;
    let udatedCount = 0;
    let surveys = formatSurvey(data?.answers, q.surveyId) || [];

    do {
      collectedCount += data?.answers?.length || 0;
      udatedCount +=
        q.surveyId === AnketologSurveyTypes.operator
          ? (await this.dbServise.db.vks.updateOperatorSurveys(
              surveys as OperatorSurveyResponse[],
            )) || 0
          : (await this.dbServise.db.vks.updateClientSurveys(
              surveys as ClientSurveyResponse[],
            )) || 0;
      surveys = await firstValueFrom(
        this.axios
          .request({
            ...postSurveyCongig,
            data: { ...surveyParams, offset: collectedCount },
          })
          .pipe(
            retry(1),
            map((res) => formatSurvey(res?.data?.answers, q.surveyId) || []),
          ),
      );
      isDev &&
        Logger.warn(
          `totalCount: ${totalCount} collectedCount: ${collectedCount} udatedCount: ${udatedCount}`,
        );
    } while (collectedCount < totalCount);
    return { found: totalCount, updated: udatedCount };
  }

  public async updateSurveyData(
    q: QmsQuery,
  ): Promise<vksUpdateQueryReturnValue> {
    const qms = await this.GetQmsReport({
      dateFrom: q.dateFrom,
      dateTo: q.dateTo,
    });
    const operator = await this.GetAnketologSurvey({
      surveyId: AnketologSurveyTypes.operator,
      dateFrom: q.dateFrom,
      dateTo: q.dateTo,
    });
    const client = await this.GetAnketologSurvey({
      surveyId: AnketologSurveyTypes.client,
      dateFrom: q.dateFrom,
      dateTo: q.dateTo,
    });
    return {
      qms,
      operator,
      client,
    };
  }

  @Cron('0 15 7,12,19 * * *')
  private async cronUpdateSurveyData() {
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    if (isDev) return;
    this.updateSurveyData({
      dateFrom: format(startOfYesterday(), 'dd.MM.yyyy'),
      dateTo: format(new Date(), 'dd.MM.yyyy'),
    }).then(() => {
      Logger.log('Survey data updated');
    });
  }

  public async ReadVksServiceTypeClassificator(): Promise<
    NestedClassificatorInfoString[]
  > {
    return this.dbServise.db.vks.getServiceTypeClassificator();
  }

  public async ReadVksDepartmentClassificator(): Promise<
    NestedClassificatorInfo[]
  > {
    return this.dbServise.db.vks.getDepartmentsClassificator();
  }

  public async ReadVksStatusClassificator(): Promise<
    NestedClassificatorInfoString[]
  > {
    return this.dbServise.db.vks.getStatusClassificator();
  }

  public async ReadVksTimeline(
    departmentIds?: number[],
  ): Promise<VksTimelinePoint[]> {
    return this.dbServise.db.vks.getVksTimeline(departmentIds);
  }

  public async ReadVksStatusStats(
    q: VksDashbordPageSearch,
  ): Promise<VksStatusStat[]> {
    return this.dbServise.db.vks.getVksStatusStats(q);
  }

  public async ReadVksDepartmentStats(
    q: VksDashbordPageSearch,
  ): Promise<VksDepartmentStat[]> {
    return this.dbServise.db.vks.getVksDepartmentStats(q);
  }

  public async ReadVksServiceStats(
    q: VksDashbordPageSearch,
  ): Promise<VksServiceStat[]> {
    return this.dbServise.db.vks.getVksServiceStats(q);
  }
}
