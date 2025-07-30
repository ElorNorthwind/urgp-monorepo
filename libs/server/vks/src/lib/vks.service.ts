import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { ANKETOLOG_HTTP_OPTIONS, QMS_HTTP_OPTIONS } from '../config/constants';
import {
  AnketologQuery,
  AnketologSurveyResponse,
  BookingClient,
  BookingRecord,
  QmsQuery,
  RawBookingRecord,
} from '@urgp/shared/entities';
import { formatBookingRecord } from './util/formatBookingRecord';
import { formatBookingClient } from './util/formatBookingClient';

@Injectable()
export class VksService {
  constructor(
    private readonly axios: HttpService,
    private configService: ConfigService,
  ) {}

  public async GetQmsReport(
    q: QmsQuery,
  ): Promise<{ clients: BookingClient[]; records: BookingRecord[] }> {
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

    const createReportConfit: AxiosRequestConfig = {
      ...QMS_HTTP_OPTIONS,
      method: 'post',
      url: '/create/' + reportTemplate,
      headers: { contentType: 'application/json', Authorization: authHeader },
    };

    const { data } = await firstValueFrom(
      this.axios.request(createReportConfit),
    );
    const reportId = data?.data?.id;

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
    const closeReportConfig: AxiosRequestConfig = {
      ...QMS_HTTP_OPTIONS,
      method: 'delete',
      headers: { contentType: 'application/json', Authorization: authHeader },
      url: `/session/close/${reportId}/`,
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

    await firstValueFrom(
      this.axios.request({ ...saveSearchParamConfit, data: dateRangeData }),
    );
    await firstValueFrom(
      this.axios.request({
        ...saveSearchParamConfit,
        data: departmentData,
      }),
    );

    await firstValueFrom(
      this.axios.request({ ...buildReportConfig, data: '' }),
    );

    const resultBuffer = new Uint8Array(
      await firstValueFrom(this.axios.request(getReportXlsConfig)).then(
        (res) => res?.data,
      ),
    );

    const wb = XLSX.read(resultBuffer, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];

    const closeReport = await firstValueFrom(
      this.axios.request(closeReportConfig),
    );

    if (closeReport?.data?.status !== 'OK') {
      throw new HttpException(closeReport?.data?.error, HttpStatus.BAD_REQUEST);
    }

    const rawData: RawBookingRecord[] = XLSX.utils.sheet_to_json(ws, {
      range: 1,
    });

    const Clients = new Map<number, BookingClient>();
    const records = rawData
      .filter((r: RawBookingRecord) => r?.['Код бронирования']?.length > 1)
      .map((r: RawBookingRecord) => {
        const formatted = formatBookingRecord(r);
        Clients.set(formatted.clientId, formatBookingClient(r));
        return formatted;
      });

    return { clients: Array.from(Clients.values()), records };
  }

  public async GetAnketologSurvey(
    q: AnketologQuery,
  ): Promise<AnketologSurveyResponse[]> {
    const apiToken = this.configService.get<string>('ANKETOLOG_API_TOKEN');

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

    const { data } = await firstValueFrom(
      this.axios.request({ ...postSurveyCongig, data: surveyParams }),
    );
    return data?.answers || [];
  }
}
