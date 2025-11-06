import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map, retry } from 'rxjs';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import fs from 'fs';
// import FormData from 'form-data';

@Injectable()
export class DtwService {
  constructor(
    private readonly axios: HttpService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getDtwMapTileStream(coords: {
    z: number;
    x: number;
    y: number;
  }): Promise<any> {
    const token = await this.getDwtToken();
    if (!token)
      throw new UnauthorizedException('Не удалось получить токен DTW');
    const { z, x, y } = coords;

    try {
      return this.axios
        .request({
          baseURL: 'https://s3-dc.mos.ru/s3b-cd-oasi-gis-pr',
          url: `/1/fgm_ofp_map/${z}/${x}/${y}.jpg`,
          params: { token },
          method: 'GET',
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'image/jpeg',
          },
        })
        .pipe(
          retry(1), // Вывести в переменную?
        );
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  public async getDwtToken(): Promise<string> {
    const cachedData = (await this.cacheManager.get(
      `dwt-public-token`,
    )) as string;
    if (cachedData) {
      return cachedData;
    }

    try {
      const { accessToken } = await this.DtwLogin();
      if (accessToken)
        await this.cacheManager.set(
          `dwt-public-token`,
          accessToken,
          60 * 1000 * 15, // Cache for 15 minutes
        );
      return accessToken;
    } catch (error) {
      Logger.error(error);
      return 'Ошибка при попытке входа в сервис DTW';
    }

    // return this.DtwLogin();
  }

  private async DtwLogin() {
    const login = await this.configService.get<string>('DTW_LOGIN');
    const password = await this.configService.get<string>('DTW_PASSWORD');

    const formData = new FormData();
    formData.append('login', login || '');
    formData.append('password', password || '');

    try {
      const loginData = await firstValueFrom(
        this.axios.request({
          url: '/auth/login',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
      ).then((res) => res.data);
      return loginData;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  private async DtwRefresh(token: string) {
    try {
      const loginData = await firstValueFrom(
        this.axios.request({
          url: '/auth/refresh',
          method: 'POST',
          data: { refreshToken: token },
        }),
      ).then((res) => res.data);
      return loginData;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
}
