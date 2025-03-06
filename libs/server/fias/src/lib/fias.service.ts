import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, from, of, retry, tap } from 'rxjs';
import {
  addressNotFound,
  FIAS_RETRY_COUNT,
  FiasAddress,
  FiasAddressWithDetails,
  FiasHint,
  hintNotFound,
  splitAddress,
} from '@urgp/shared/entities';

@Injectable()
export class FiasService {
  constructor(
    private readonly axios: HttpService,
    private configService: ConfigService,
  ) {}

  public async getDirectAddress(
    address: string,
  ): Promise<FiasAddressWithDetails> {
    const apiKey = this.configService.get<string>('FIAS_KEY');
    if (!apiKey) throw new NotFoundException('Не найден ключь ФИАС!');
    const fullAddress = /[Мм]осква/.test(address)
      ? address
      : 'Москва, ' + address;
    // Параметры запроса на подсказку адреса
    const directAddressConfig: AxiosRequestConfig = {
      method: 'get',
      url: '/SearchAddressItems',
      headers: { 'master-token': apiKey },
      params: {
        search_string: fullAddress,
        address_type: 2,
      },
    };

    try {
      const { data } = await firstValueFrom(
        this.axios.request(directAddressConfig).pipe(
          // tap(() => Logger.log('fias request: ' + address)),
          // tap(() => Logger.log(splitAddress(address))),
          retry(FIAS_RETRY_COUNT),
          catchError(() => {
            return of({ data: [addressNotFound] });
          }),
        ),
      );
      const addresses = data?.addresses as FiasAddress[];
      if (!addresses || addresses.length === 0) return addressNotFound;

      const fiasSuggestions = addresses.filter(
        (address) =>
          address.object_level_id >= 10 && // Только дома и ниже
          address.path.slice(0, 7) === '1405113', // Должно быть в Москве
      );

      if (fiasSuggestions.length === 0) return addressNotFound;

      const houseId = fiasSuggestions[0]?.hierarchy?.find(
        (item) => item.object_level_id === 10,
      )?.object_id;

      const house =
        fiasSuggestions[0].object_level_id !== 10
          ? addresses.find((address) => address.object_id === houseId)
          : fiasSuggestions[0];

      // const houseCadNum =
      //   fiasSuggestions[0].object_level_id > 10
      //     ? fiasSuggestions.find((address) => address.object_id === houseId)
      //         ?.address_details?.cadastral_number || null
      //     : fiasSuggestions[0].address_details.cadastral_number;
      // if (fiasSuggestions[0].object_level_id > 10) return fiasSuggestions[0];

      return {
        ...fiasSuggestions[0],
        house_cad_num: house?.address_details?.cadastral_number || null,
        confidence: 'medium',
      };
    } catch (error) {
      Logger.error(error);
      return addressNotFound;
    }
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
        this.axios.request(hintConfig).pipe(
          retry(FIAS_RETRY_COUNT),
          catchError(() => {
            return of({ data: [hintNotFound] });
          }),
        ),
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
        this.axios.request(getAddressConfig(object_id)).pipe(
          retry(FIAS_RETRY_COUNT),
          catchError(() => {
            return of({ data: [addressNotFound] });
          }),
        ),
      );
      return data?.addresses?.[0] ?? addressNotFound;
    } catch (error) {
      Logger.error(error);
      return addressNotFound;
    }
  }
}
