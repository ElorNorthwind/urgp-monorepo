import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  addressToParts,
  DaDataAddress,
  DaDataResult,
} from '@urgp/shared/entities';
import { AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, of, tap } from 'rxjs';

@Injectable()
export class DaDataService {
  constructor(
    private readonly axios: HttpService,
    private configService: ConfigService,
  ) {}

  public async getFiasGuidByAddressString(
    address: string,
    validationStr?: string,
    mainWord?: string,
  ): Promise<DaDataResult> {
    const apiKey = this.configService.get<string>('DADATA_KEY1');
    if (!apiKey) throw new NotFoundException('Не найден ключь ДаДаты!');

    const fullAddress = /[Мм]осква/.test(address)
      ? address
      : 'Москва, ' + address;

    // Параметры запроса на подсказку адреса
    const addressConfig: AxiosRequestConfig = {
      method: 'post',
      url: '/suggest/address',
      headers: { Authorization: `Token ${apiKey}` },
      data: {
        query: fullAddress,
      },
    };

    let dadataRequests = 0;

    const guidNotFound = {
      object_guid: '',
      house_cad_num: '',
      confidence: 'none',
      response_source: 'dadata-hint',
    };

    try {
      const { data } = await firstValueFrom(
        this.axios.request(addressConfig).pipe(
          tap(() => {
            dadataRequests += 1;
          }),
          // retry(FIAS_RETRY_COUNT),
          catchError(() => {
            return of({ data: [] });
          }),
        ),
      );

      const addresses = data?.suggestions as DaDataAddress[];
      if (!addresses || addresses.length === 0)
        return { ...guidNotFound, dadataRequests };

      const dadataSuggestions = addresses.filter(
        (address) =>
          parseInt(address?.data?.fias_level || '') >= 8 && // Только дома и ниже. Почемуто в ДаДате не такие уровни как в ФИАС
          (address?.data?.region_kladr_id || '') === '7700000000000', // Должно быть в Москве
      );

      if (dadataSuggestions.length === 0)
        return { ...guidNotFound, dadataRequests };

      const validatedAddress = dadataSuggestions.find(
        (address) =>
          validationStr &&
          mainWord &&
          addressToParts(address.value)?.validationStr === validationStr &&
          address.value.toLowerCase().includes(mainWord.toLowerCase()),
      );

      const requestResult = validatedAddress
        ? { ...validatedAddress, confidence: 'medium' }
        : { ...dadataSuggestions[0], confidence: 'low' };

      return {
        object_guid: requestResult?.data?.fias_id || '',
        house_cad_num: requestResult?.data?.house_cadnum || '',
        confidence: requestResult?.confidence || 'none',
        response_source: 'fias-search',
        dadataRequests,
        extra: {
          validationStr:
            validationStr +
              ' -> ' +
              addressToParts(requestResult?.value || '')?.validationStr || '',
        },
      };
    } catch (error) {
      Logger.error(error);
      return {
        ...guidNotFound,
        dadataRequests,
      };
    }
  }
}
