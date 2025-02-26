import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { AdressRegistryRowSlim, DataMosAdress } from '../config/types';
import { convertDataMosAdress } from './helper/convertDataMosAdress';
import { AccessTokenGuard } from '@urgp/server/auth';
import { splitAddress } from './helper/splitAddress';
import { calculateStreetFromDB } from './helper/calculateStreetFromDB';

@Injectable()
export class DataMosService {
  constructor(
    private readonly axios: HttpService,
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
  ) {}

  private async countUpdated(): Promise<number> {
    return this.dbServise.db.address.countUpdated();
  }
  private async clearUpdated(): Promise<null> {
    return this.dbServise.db.address.clearUpdated();
  }

  public async updateAdresses(): Promise<any> {
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

    try {
      const { data: total } = await firstValueFrom(
        this.axios.request(countConfig),
      );
      let current = (await this.countUpdated()) || 0;

      if (current === total) {
        await this.clearUpdated();
      }

      do {
        const { data: additionalData }: { data: DataMosAdress[] } =
          await firstValueFrom(this.axios.request(getRowConfig(current, 1000)));

        this.dbServise.db.address.upsertAdresses(
          convertDataMosAdress(additionalData) || [],
        );
        current = current + additionalData?.length || 0;

        // additionalData.map((d) => {
        //   Logger.warn(splitAddress(d?.Cells?.SIMPLE_ADDRESS || ''));
        // });

        Logger.log(`Загружено ${current} из ${total}`);
      } while (current < total);
      return { count: total, error: undefined };
    } catch (error) {
      Logger.error(error);
      return { count: 0, error };
    }
  }
  public async calculateStreets(limit: number = 1000): Promise<any> {
    let offset = 0;
    const total = await this.dbServise.db.address.countTotal();

    do {
      const batch = await this.dbServise.db.address.readPaginatedAddresses({
        limit,
        offset,
      });

      const calculatedStreets = batch.map((d) => ({
        global_id: BigInt(d.global_id),
        street_calc: calculateStreetFromDB(d),
      }));
      this.dbServise.db.address.updateCalcStreets(calculatedStreets);
      offset = offset + limit;
      Logger.log(`Обработано ${offset} из ${total}`);
    } while (offset < total);
    return { count: total, error: undefined };
  }
}
