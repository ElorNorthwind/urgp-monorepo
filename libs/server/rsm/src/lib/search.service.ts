import { Injectable, Logger } from '@nestjs/common';
import { RsmHttpService } from '@urgp/server/external-auth';
import { RsmSearchParams, RsmSearchResult } from '../model/types';
import { formatSearchQueryString } from '../util/formatRsmSearchQuery';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RsmSearchService {
  constructor(private readonly rsm: RsmHttpService) {}

  public async search(params: RsmSearchParams): Promise<RsmSearchResult> {
    const { registerId, layoutId, query } = params;
    const { searchQuery, countQuery } = formatSearchQueryString(query);
    const UniqueSessionKey = uuidv4();

    // Параметры запроса на получение первой страницы результатов
    const searchConfig: AxiosRequestConfig = {
      method: 'get',
      url: '/Registers/GetData',
      params: {
        RegisterId: registerId,
        LayoutId: layoutId,
        UniqueSessionKey,
        ...searchQuery,
      },
    };

    // Параметры запроса на подсчёт количества найденых записей
    const countConfig: AxiosRequestConfig = {
      method: 'get',
      url: `/Registers/GetCount`,
      params: {
        registerId,
        UniqueSessionKey,
        parametersJson: JSON.stringify({
          RegisterId: registerId,
          LayoutId: layoutId,
          ...countQuery,
        }),
      },
    };

    // fetch("http://10.15.179.52:5222/Registers/GetCount?parametersJson=%7B%22RegisterId%22%3A%22BtiBuilding%22%2C%22SearchApplied%22%3Atrue%2C%22PageChanged%22%3Afalse%2C%22Page%22%3A1%2C%22PageSize%22%3A30%2C%22SelectAll%22%3Afalse%2C%22ClearSelection%22%3Afalse%2C%22LayoutId%22%3A%226030001%22%2C%22RegisterViewId%22%3A%22BtiBuilding%22%2C%22LayoutRegisterId%22%3A%220%22%2C%22FilterRegisterId%22%3A%220%22%2C%22ListRegisterId%22%3A%220%22%2C%22searchData%22%3A%5B%7B%22key%22%3A%22Subject%22%2C%22value%22%3A%22%5B29057%5D%22%7D%2C%7B%22key%22%3A%22Street%22%2C%22value%22%3A%22%5B194112%5D%22%7D%5D%2C%22SearchDynamicControlData%22%3A%22%5B%5D%22%2C%22databaseFilters%22%3A%5B%5D%2C%22selectedLists%22%3A%5B%5D%2C%22UniqueSessionKey%22%3A%22e5cfbfcb-87c3-465e-b179-a183252d10fd%22%2C%22UniqueSessionKeySetManually%22%3Atrue%2C%22ContentLoadCounter%22%3A1%2C%22CurrentLayoutId%22%3A%226030001%22%7D&registerId=BtiBuilding&uniqueSessionKey=e5cfbfcb-87c3-465e-b179-a183252d10fd", {
    //   "headers": {
    //     "accept": "*/*",
    //     "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    //     "x-requested-with": "XMLHttpRequest"
    //   },
    //   "referrer": "http://10.15.179.52:5222/RegistersView?LayoutId=6030001&RegisterId=BtiBuilding",
    //   "referrerPolicy": "strict-origin-when-cross-origin",
    //   "body": null,
    //   "method": "GET",
    //   "mode": "cors",
    //   "credentials": "include"
    // });

    // Параметры запроса дополнительных данных
    const additionalDataConfig: AxiosRequestConfig = {
      method: 'get',
      url: `/Registers/GetAddData`,
      params: { registerId, UniqueSessionKey },
    };

    try {
      // Отправляем парарельные запросы на получение первой страницвы данных и общего числа найденых записей
      const [{ data: count = 0 }, { data: initialData }] = await Promise.all([
        firstValueFrom(this.rsm.request(countConfig)),
        firstValueFrom(this.rsm.request(searchConfig)),
      ]);
      let data = initialData?.Data || [];

      // Догружаем оставшиеся станицы, пока число полученных записей не станет равно их общему количеству
      do {
        const { data: additionalData } = await firstValueFrom(
          this.rsm.request(additionalDataConfig),
        );
        data = data.concat(additionalData || []);
      } while (data.length < count);

      // возвращаем объект с данными
      return { data, count, error: undefined };
    } catch (error) {
      Logger.error(error);
      return { data: [], count: 0, error };
    }
  }
}
