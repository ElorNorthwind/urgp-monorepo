import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, from, map, of, retry, tap } from 'rxjs';
import {
  addressNotFound,
  FIAS_RETRY_COUNT,
  FiasAddress,
  FiasAddressPart,
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

  public async getAddressByPart(
    part: FiasAddressPart,
  ): Promise<FiasAddressWithDetails> {
    const apiKey = this.configService.get<string>('FIAS_KEY');
    if (!apiKey) throw new NotFoundException('Не найден ключь ФИАС!');

    // TODO: Доп проверки на плохо написанные квартиры выше уровнем?
    const hasFlat = part?.flat?.number && part?.flat?.number !== '';

    const requestData = {
      region: {
        name: 'Москва',
        type_name: 'город',
      },
      object_level_id: hasFlat ? 11 : 10,
      street: part.street, // TODO: Дочищать адреса надо лучше! г Москва вот это вот все
      house: part.house,
      flat: hasFlat ? part.flat : undefined,
    };

    // Параметры запроса на адрес по ID
    const addressConfig: AxiosRequestConfig = {
      method: 'post',
      url: '/SearchByParts',
      headers: { 'master-token': apiKey },
      data: requestData,
    };

    let requests = 0;

    try {
      const { data } = await firstValueFrom(
        this.axios.request(addressConfig).pipe(
          tap(() => {
            requests += 1;
          }),
          retry(FIAS_RETRY_COUNT),
          catchError(() => {
            return of({ data: [addressNotFound] });
          }),
        ),
      );
      // Logger.debug(data);

      const resultData =
        (data?.address_item as FiasAddress | undefined) ?? addressNotFound;
      const problems = data?.description ?? null;

      return {
        ...resultData,
        requests,
        response_source: 'fias-parts',
        house_cad_num:
          resultData?.object_level_id === 10
            ? (resultData?.address_details?.cadastral_number ?? null)
            : null,
        confidence: resultData?.object_id > 0 ? 'hight' : 'none',
        extra: { problems },
      };
    } catch (error) {
      Logger.error(error);
      return { ...addressNotFound, requests };
    }
  }

  public async getAddressByString(
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

    let requests = 0;

    try {
      const { data } = await firstValueFrom(
        this.axios.request(directAddressConfig).pipe(
          // tap(() => Logger.log('fias request: ' + address)),
          // tap(() => Logger.log(split Address(address))),
          // tap((resp) => Logger.log(resp.data)),
          tap(() => {
            requests += 1;
          }),
          retry(FIAS_RETRY_COUNT),
          catchError(() => {
            return of({ data: [addressNotFound] });
          }),
        ),
      );
      const addresses = data?.addresses as FiasAddress[];
      if (!addresses || addresses.length === 0)
        return { ...addressNotFound, requests };

      const fiasSuggestions = addresses.filter(
        (address) =>
          address.object_level_id >= 10 && // Только дома и ниже
          address.path.slice(0, 7) === '1405113', // Должно быть в Москве
      );

      if (fiasSuggestions.length === 0) return { ...addressNotFound, requests };

      const {
        validationStr,
        street: streetStr,
        house: houseStr,
        apartment: apartmentStr,
      } = splitAddress(address);

      this.getAddressByPart({
        street: { name: streetStr },
        house: { number: houseStr },
        flat: { number: apartmentStr },
      });

      const validatedAddress = fiasSuggestions.find(
        (address) =>
          splitAddress(address.full_name)?.validationStr === validationStr,
      );

      const requestResult = validatedAddress
        ? { ...validatedAddress, confidence: 'medium' }
        : { ...fiasSuggestions[0], confidence: 'low' };

      const houseId = requestResult?.hierarchy?.find(
        (item) => item.object_level_id === 10,
      )?.object_id;

      const house =
        requestResult.object_level_id !== 10
          ? addresses.find((address) => address.object_id === houseId)
          : requestResult;

      let houseCadNum = house?.address_details?.cadastral_number;

      // if (houseId && (!houseCadNum || houseCadNum === '')) {
      if (houseId && !house) {
        requests += 1;
        houseCadNum = (await this.getAddressById(houseId))?.address_details
          ?.cadastral_number;
      }

      return {
        ...requestResult,
        house_cad_num: houseCadNum || null,
        requests,
        // for testing
        extra: {
          validationStr:
            validationStr +
              ' -> ' +
              splitAddress(requestResult.full_name)?.validationStr || '',
          streetStr,
          houseStr,
          apartmentStr,
        },
      };
    } catch (error) {
      Logger.error(error);
      return { ...addressNotFound, requests };
    }
  }

  public async getAddressById(fiasId: number): Promise<FiasAddressWithDetails> {
    const apiKey = this.configService.get<string>('FIAS_KEY');
    if (!apiKey) throw new NotFoundException('Не найден ключь ФИАС!');

    // Параметры запроса на адрес по ID
    const addressConfig: AxiosRequestConfig = {
      method: 'get',
      url: '/GetAddressItemById',
      headers: { 'master-token': apiKey },
      params: {
        address_type: 2,
        object_id: fiasId,
      },
    };

    try {
      const { data } = await firstValueFrom(
        this.axios.request(addressConfig).pipe(
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

  // public async getAddressHint(address: string): Promise<FiasHint> {
  //   const apiKey = this.configService.get<string>('FIAS_KEY');
  //   if (!apiKey) throw new NotFoundException('Не найден ключь ФИАС!');
  //   // Параметры запроса на подсказку адреса
  //   const hintConfig: AxiosRequestConfig = {
  //     method: 'post',
  //     url: '/GetAddressHint',
  //     headers: { 'master-token': apiKey },
  //     data: {
  //       searchString: address,
  //       addressType: 1,
  //       upToLevel: 11,
  //       locationsBoost: 1405113,
  //     },
  //   };

  //   try {
  //     const { data } = await firstValueFrom(
  //       this.axios.request(hintConfig).pipe(
  //         retry(FIAS_RETRY_COUNT),
  //         catchError(() => {
  //           return of({ data: [hintNotFound] });
  //         }),
  //       ),
  //     );
  //     const hints = data?.hints as FiasHint[];

  //     if (!hints || hints.length === 0) return hintNotFound;
  //     return (
  //       hints.find(
  //         (h) =>
  //           h.path.split('.').length >= 3 && h.path.slice(0, 7) === '1405113',
  //       ) ?? hintNotFound
  //     );
  //   } catch (error) {
  //     Logger.error(error);
  //     return hintNotFound;
  //   }
  // }
  // public async getAddress(address: string): Promise<FiasAddress> {
  //   const apiKey = this.configService.get<string>('FIAS_KEY');
  //   if (!apiKey) throw new NotFoundException('Не найден ключь ФИАС!');

  //   // Параметры запроса на подсказку адреса
  //   const getAddressConfig = (object_id: number): AxiosRequestConfig => ({
  //     method: 'get',
  //     url: '/GetAddressItemById',
  //     headers: { 'master-token': apiKey },
  //     params: {
  //       address_type: 1,
  //       object_id,
  //     },
  //   });

  //   try {
  //     const { object_id } = await this.getAddressHint(address);
  //     if (!object_id || object_id === -1) return addressNotFound;

  //     const { data } = await firstValueFrom(
  //       this.axios.request(getAddressConfig(object_id)).pipe(
  //         retry(FIAS_RETRY_COUNT),
  //         catchError(() => {
  //           return of({ data: [addressNotFound] });
  //         }),
  //       ),
  //     );
  //     return data?.addresses?.[0] ?? addressNotFound;
  //   } catch (error) {
  //     Logger.error(error);
  //     return addressNotFound;
  //   }
  // }
}
