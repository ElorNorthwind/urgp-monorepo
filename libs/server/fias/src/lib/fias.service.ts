import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom, retry } from 'rxjs';
import {
  addressNotFound,
  FIAS_RETRY_COUNT,
  hintNotFound,
} from '../config/constants';
import { FiasAddress, FiasHint } from '@urgp/shared/entities';

@Injectable()
export class FiasService {
  constructor(
    private readonly axios: HttpService,
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
  ) {}
  static get emptyAddress(): FiasAddress {
    return addressNotFound;
  }

  public async getAddressHint(address: string): Promise<FiasHint> {
    const apiKey = this.configService.get<string>('FIAS_KEY');
    if (!apiKey) throw new NotFoundException('Не найден ключь ФИАС!');
    // Параметры запроса на подсказку адреса
    const hintConfig: AxiosRequestConfig = {
      method: 'post',
      url: '/GetAddressHint',
      headers: { 'master-token': apiKey },
      data: {
        searchString: address,
        addressType: 1,
        upToLevel: 11,
        locationsBoost: 1405113,
      },
    };

    try {
      const { data } = await firstValueFrom(
        this.axios.request(hintConfig).pipe(retry(FIAS_RETRY_COUNT)),
      );
      const hints = data?.hints as FiasHint[];

      if (!hints || hints.length === 0) return hintNotFound;
      return (
        hints.find(
          (h) =>
            h.path.split('.').length >= 3 && h.path.slice(0, 7) === '1405113',
        ) ?? hintNotFound
      );
    } catch (error) {
      Logger.error(error);
      return hintNotFound;
    }
  }
  public async getAddress(address: string): Promise<FiasAddress> {
    const apiKey = this.configService.get<string>('FIAS_KEY');
    if (!apiKey) throw new NotFoundException('Не найден ключь ФИАС!');
    // Параметры запроса на подсказку адреса
    const getAddressConfig = (object_id: number): AxiosRequestConfig => ({
      method: 'get',
      url: '/GetAddressItemById',
      headers: { 'master-token': apiKey },
      params: {
        address_type: 1,
        object_id,
      },
    });

    try {
      const { object_id } = await this.getAddressHint(address);
      if (!object_id || object_id === -1) return addressNotFound;

      const { data } = await firstValueFrom(
        this.axios
          .request(getAddressConfig(object_id))
          .pipe(retry(FIAS_RETRY_COUNT)),
      );
      return data?.addresses?.[0] ?? hintNotFound;
    } catch (error) {
      Logger.error(error);
      return addressNotFound;
    }
  }
}
