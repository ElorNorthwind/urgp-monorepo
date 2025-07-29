import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable()
export class QmsService {
  constructor(
    private readonly axios: HttpService,
    private configService: ConfigService,
  ) {}

  public async test(): Promise<any> {
    const authHeader = this.configService.get<string>('QMS_AUTH_HEADER');
    const reportTemplate = this.configService.get<string>(
      'QMS_REPORT_TEMPLATE_ID',
    );
    const dateRangeInputId = this.configService.get<string>(
      'QMS_DATE_RANGE_INPUT_ID',
    );
    const departmentInputId = this.configService.get<string>(
      'QMS_DEPARTMENT_INPUT_ID',
    );
    const departmentValue = this.configService.get<string>(
      'QMS_DEPARTMENT_VALUE',
    );

    if (
      !reportTemplate ||
      !authHeader ||
      !dateRangeInputId ||
      !departmentInputId ||
      !departmentValue
    ) {
      throw new HttpException('QMS env data not found', HttpStatus.BAD_REQUEST);
    }

    const createReportConfit: AxiosRequestConfig = {
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
      method: 'post',
      url: '/report/parameters/save',
      headers: { contentType: 'application/json', Authorization: authHeader },
    };

    const buildReportConfig: AxiosRequestConfig = {
      method: 'put',
      url: `/report/${reportId}/build/`,
      headers: { contentType: 'application/json', Authorization: authHeader },
    };

    const getReportXlsConfig: AxiosRequestConfig = {
      method: 'get',
      headers: { Authorization: authHeader },
      url: `/report/${reportId}/export/format/XLS/`,
      responseType: 'arraybuffer',
    };
    const closeReportConfig: AxiosRequestConfig = {
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
}
