import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { ANKETOLOG_HTTP_OPTIONS, QMS_HTTP_OPTIONS } from '../config/constants';

@Injectable()
export class VksService {
  constructor(
    private readonly axios: HttpService,
    private configService: ConfigService,
  ) {}

  public async GetQmsReport(): Promise<any> {
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

    Logger.log('Creating report + ' + reportId);

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
        { id: null, feature: 'first', value: '28.07.2025', customData: true },
        { id: null, feature: 'last', value: '29.07.2025', customData: true },
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

    Logger.debug(XLSX.utils.sheet_to_json(ws, { range: 1 }));

    return firstValueFrom(this.axios.request(closeReportConfig)).then(
      (res) => res.data,
    );
  }

  public async GetAnketologUserReport(): Promise<any> {
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
      survey_id: 124684,
      date_from: '29.07.2025',
      date_to: '30.07.2025',
    };

    // servey_list = [124684, 124915]

    const { data } = await firstValueFrom(
      this.axios.request({ ...postSurveyCongig, data: surveyParams }),
    );
    return data;
  }

  public async GetAnketologClientReport(): Promise<any> {
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
      survey_id: 124915,
      date_from: '01.07.2025',
      date_to: '30.07.2025',
    };

    // servey_list = [124684, 124915]

    const { data } = await firstValueFrom(
      this.axios.request({ ...postSurveyCongig, data: surveyParams }),
    );
    return data;
  }
}
