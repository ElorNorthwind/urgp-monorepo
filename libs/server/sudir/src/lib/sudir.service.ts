import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { generateSudirPoW } from './util/generateSudirPoW';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { parse, valid, type HTMLElement } from 'node-html-parser';

@Injectable()
export class SudirService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly configService: ConfigService,
    private readonly axios: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async generateSudirPoW(input: string): Promise<string> {
    return generateSudirPoW(input);
  }
  public async loginEdo(login: string, password: string): Promise<any> {
    const cachedData = await this.cacheManager.get(
      `edo-session-${login}-${password}`,
    );
    if (cachedData) {
      return cachedData;
    }
    const cacheTtlMinutes =
      parseInt(this.configService.get<string>('EDO_SESSION_TTL') || '5') || 5;

    const firstUrl = await firstValueFrom(
      this.axios
        .request({
          url: 'https://mosedo.mos.ru/auth.php?DNSID=openid&openid',
          method: 'GET',
          maxRedirects: 0,
          validateStatus: (status: number) => [200, 302, 303].includes(status),
        })
        .pipe(map((response) => response?.headers?.['location'])),
    );

    const { 'set-cookie': cookies, location: secondLocation } =
      await firstValueFrom(
        this.axios
          .request({
            url: firstUrl,
            method: 'GET',
            maxRedirects: 0,
            validateStatus: (status: number) =>
              [200, 302, 303].includes(status),
          })
          .pipe(map((response) => response?.headers)),
      );

    const { data, headers } = await firstValueFrom(
      this.axios.request({
        baseURL: 'https://sudir.mos.ru',
        url: secondLocation,
        headers: { cookie: cookies },
        method: 'GET',
        maxRedirects: 0,
        validateStatus: (status: number) => [200, 302, 303].includes(status),
      }),
    );

    // Невалидный HTML (невозможно распарсить в принципе)
    if (!valid(data))
      throw new HttpException('Invalid document HTML', HttpStatus.BAD_REQUEST);

    const body = parse(data);

    const powTask = body?.getElementById('pow')?.getAttribute('value');

    const thirdLocation = await firstValueFrom(
      this.axios
        .request({
          baseURL: 'https://sudir.mos.ru',
          url: secondLocation,
          headers: { cookie: cookies },
          method: 'POST',
          data: {
            pow: await this.generateSudirPoW(powTask || ''),
            login,
            password,
          },
          maxRedirects: 0,
          validateStatus: (status: number) => [200, 302, 303].includes(status),
        })
        .pipe(map((response) => response?.headers?.['location'])),
    );

    if (!thirdLocation)
      throw new UnauthorizedException(
        'Не удалось войти в СЭДО (проверьте логин и пароль)',
      );

    const DNSID = thirdLocation.match(/DNSID=([a-zA-Z\d\-\_]*)/)[1];
    const code = thirdLocation.match(/code=([a-zA-Z\d\-\_]*)/)[1];
    const state = thirdLocation.match(/state=([a-zA-Z\d]*)/)[1];

    const backToEdo = await firstValueFrom(
      this.axios
        .request({
          baseURL: 'https://mosedo.mos.ru',
          url: `auth.php?DNSID=${DNSID}&keep_session=1&code=${code}&state=${state}`,
          method: 'GET',
          maxRedirects: 0,
          validateStatus: (status: number) => [200, 302, 303].includes(status),
        })
        .pipe(map((response) => response?.headers)),
    );

    const backToEdo2 = await firstValueFrom(
      this.axios
        .request({
          url: backToEdo?.['location'],
          method: 'GET',
          maxRedirects: 0,
          validateStatus: (status: number) => [200, 302, 303].includes(status),
        })
        .pipe(map((response) => response?.headers)),
    );

    const authCookie = backToEdo2?.['set-cookie']?.[0];
    const authCode =
      authCookie?.match(/(auth_token_s_[a-zA-Z\d\%\=\-\_]*);/)?.[1] || null;

    await this.cacheManager.set(
      `edo-session-${login}-${password}`,
      {
        DNSID,
        authCode,
      },
      60 * 1000 * cacheTtlMinutes, // Cache for 5 minutes
    );
    return {
      DNSID,
      authCode,
    };
  }

  async loginUserEdo(userId: number) {
    const credentials =
      await this.dbServise.db.sudir.getUserCredentials(userId);
    if (!credentials) {
      throw new BadRequestException(
        `Пользователь с id ${userId} не найден в БД`,
      );
    }
    if (!credentials.login || !credentials.password) {
      throw new BadRequestException(
        `Логин и пароль пользователя c id ${userId} не внесены в БД`,
      );
    }
    Logger.debug(credentials);
    return this.loginEdo(credentials.login, credentials.password);
  }

  async loginMasterEdo() {
    const masterUserId =
      parseInt(this.configService.get<string>('EDO_MASTER_USER_ID') || '22') ||
      22;
    return this.loginUserEdo(masterUserId);
  }
}
