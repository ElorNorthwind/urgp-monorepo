import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '@urgp/server/database';
import { AxiosRequestConfig } from 'axios';
import {
  catchError,
  firstValueFrom,
  from,
  map,
  mergeMap,
  Observable,
  retry,
} from 'rxjs';
import { DataMosAdress, TransportStationRow } from '../config/types';
import { calculateStreetFromDB } from './helper/calculateStreetFromDB';
import { convertDataMosAdress } from './helper/convertDataMosAdress';
import { convertDataMosTransportStation } from './helper/convertDataMosTransportStation';
import { GeoDbService } from '@urgp/server/geo-db';
import { resolve } from 'path';

@Injectable()
export class DataMosService {
  private updatedAddressCount = 0;
  constructor(
    private readonly axios: HttpService,
    private readonly dbServise: GeoDbService,
    private configService: ConfigService,
  ) {}

  private async upsertAddressBatch(
    skip: number = 0,
    top: number = 1000,
    retryCount: number = 2,
  ): Promise<number> {
    const apiKey = this.configService.get<string>('OPEN_MOS_KEY');
    if (!apiKey)
      throw new NotFoundException('Не найден ключь открытых данных!');
    // Параметры запроса на получение записей датасета
    const getRowConfig = (skip?: number, top?: number) => ({
      method: 'get',
      url: '/60562/rows',
      params: {
        api_key: apiKey,
        $orderby: 'global_id',
        $top: top || 1000,
        $skip: skip || 0,
      },
    });
    let retryAttempts = 0;
    do {
      try {
        const { data: additionalData }: { data: DataMosAdress[] } =
          await firstValueFrom(this.axios.request(getRowConfig(skip, top)));
        await this.dbServise.db.dataMos.upsertAdresses(
          convertDataMosAdress(additionalData) || [],
        );
        return additionalData?.length || 0;
      } catch (error) {
        retryAttempts++;
        Logger.warn(
          'Ошибка получения очередной группы адресов (от ' +
            skip +
            ' до ' +
            (skip + top) +
            '). Повторная попытка № ' +
            retryAttempts,
        );
        if (retryAttempts < retryCount) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          throw error;
        }
      }
    } while (retryAttempts < retryCount);
    return new Promise((resolve) => resolve(0));
  }

  public async updateAdresses(skip: number = 0): Promise<any> {
    const retryCount = 2;
    const apiKey = this.configService.get<string>('OPEN_MOS_KEY');
    if (!apiKey)
      throw new NotFoundException('Не найден ключь открытых данных!');

    // Параметры запроса на общее число записей в датасете
    const countConfig: AxiosRequestConfig = {
      method: 'get',
      url: '/60562/count',
      params: {
        api_key: apiKey,
      },
    };

    try {
      const { data: total } = await firstValueFrom(
        this.axios.request(countConfig),
      );
      this.updatedAddressCount = skip;

      if (this.updatedAddressCount >= total) {
        this.updatedAddressCount = 0;
      }

      do {
        try {
          this.updatedAddressCount += await this.upsertAddressBatch(
            this.updatedAddressCount,
            1000,
            retryCount,
          );
          Logger.log(`Загружено ${this.updatedAddressCount} из ${total}`);
        } catch (error) {
          Logger.error(error);
          'Ошибка добавления! Пропускаю адреса от ' +
            this.updatedAddressCount +
            ' до ' +
            (this.updatedAddressCount + 1000);
          this.updatedAddressCount += 1000;
        }
      } while (this.updatedAddressCount < total);
      return { count: this.updatedAddressCount, error: undefined };
    } catch (error) {
      Logger.error(error);
      return { count: 0, error };
    }
  }

  public async updateTransportStations(
    type: TransportStationRow['station_type'],
  ): Promise<any> {
    const apiKey = this.configService.get<string>('OPEN_MOS_KEY');

    const datasets = {
      metro: '624',
      rail: '62890',
      mcd: '62207',
    };

    if (!apiKey)
      throw new NotFoundException('Не найден ключь открытых данных!');

    // Параметры запроса на общее число записей в датасете
    const countConfig: AxiosRequestConfig = {
      method: 'get',
      url: '/' + datasets[type] + '/count',
      params: {
        api_key: apiKey,
      },
    };

    // Параметры запроса на получение записей датасета
    const getRowConfig = (skip?: number, top?: number) => ({
      method: 'get',
      url: '/' + datasets[type] + '/rows',
      params: {
        api_key: apiKey,
        $orderby: 'global_id',
        $top: top || 1000,
        $skip: skip || 0,
      },
    });

    try {
      const { data: total } = await firstValueFrom(
        this.axios.request(countConfig),
      );

      let current = 0;

      do {
        const { data: additionalData }: { data: any[] } = await firstValueFrom(
          this.axios.request(getRowConfig(current, 1000)),
        );

        this.dbServise.db.dataMos.upsertTransportStations(
          convertDataMosTransportStation(additionalData, type) || [],
        );

        current = current + additionalData?.length || 0;
        Logger.log(`Загружено ${current} из ${total} для типа ${type}`);
      } while (current < total);
      return { count: total, error: undefined };
    } catch (error) {
      Logger.error(error);
      return { count: 0, error };
    }
  }

  @Cron('0 0 1 * * 6')
  public async updateTransportStationsAll(): Promise<void> {
    for (const type of ['rail', 'mcd', 'metro'] as const) {
      await this.updateTransportStations(type);
    }
    // return Promise.all([
    //   this.updateTransportStations('rail'),
    //   this.updateTransportStations('metro'),
    //   this.updateTransportStations('mcd'),
    // ]);
  }
}
