import { Module, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import * as iconv from 'iconv-lite';
import { EDO_HTTP_OPTIONS } from '../../config/request-config';
import { EdoHttpService } from './edo-http-service';
import { ExternalAuthService } from '../external-auth.service';
import {
  AuthRequestDto,
  authRequestDto,
  EdoSessionInfo,
} from '@urgp/server/entities';
import { DatabaseModule } from '@urgp/server/database';
import { ExternalAuthModule } from '../external-auth.module';
import { ExternalTokenService } from '../external-token.service';
import { ExternalSessionsService } from '../external-sessions.service';
import { EdoTestController } from './edo-api.controller';
import { ResponseType } from 'axios';

@Module({
  imports: [
    HttpModule.register({
      ...EDO_HTTP_OPTIONS,
      responseType: 'arraybuffer' as ResponseType,
      responseEncoding: 'binary',
    }),
    DatabaseModule,
    ExternalAuthModule,
  ],
  providers: [
    {
      provide: EdoHttpService,
      useExisting: HttpService,
    },
    ExternalAuthService,
    ExternalTokenService,
    ExternalSessionsService,
  ],
  exports: [EdoHttpService],
  controllers: [EdoTestController],
})
export class EdoApiModule implements OnModuleInit {
  constructor(
    private readonly auth: ExternalAuthService,
    private readonly httpService: EdoHttpService,
  ) {}

  onModuleInit() {
    const auth = this.auth;
    const http = this.httpService;
    // request interceptor
    http.axiosRef.interceptors.request.use(
      async function (config) {
        // Пропускаем запросы, сделанные в адрес страницы авторизации
        if (config?.url?.includes('auth.php')) {
          return config;
        }

        const authLookupParams: AuthRequestDto = authRequestDto.parse(
          config?.params?.x_auth_lookup || { userId: 22 }, // NOT OKAY
        );

        const session: EdoSessionInfo = (await auth.getExternalAuthData({
          ...authLookupParams,
          system: 'EDO',
        })) as EdoSessionInfo;

        config.params.DNSID = session.token.dnsid;
        config.headers['cookie'] = `auth_token=${session.token.authToken};`;
        config.withCredentials = true;

        config.params.x_auth_lookup = {
          ...config.params.x_auth_lookup,
          isFresh: session.isFresh,
        };

        return config;
      },

      function (error) {
        return Promise.reject(error);
      },
    );

    // response interceptor
    http.axiosRef.interceptors.response.use(
      async function (response) {
        // автоматически рекодируем данные в UTF-8
        const ctype = response.headers['content-type'];
        if (ctype.includes('charset=windows-1251')) {
          response.data = iconv.decode(Buffer.from(response.data), 'win1251');
        }

        // Пропускаем ответы по запросам, которые:
        if (
          response?.config?.url?.includes('auth.php') || // уходили к странице авторизации
          !response.request?.res?.responseUrl?.includes('auth.php') || // не были перенаправлены на страницу авторизации
          response?.config?.params?.x_auth_lookup?.isFresh // уже сделаны со "свежей" авторизацией, а не данными ранее сохранённой сессии
        ) {
          return response;
        }

        const authLookupParams: AuthRequestDto = authRequestDto.parse(
          response?.config?.params?.x_auth_lookup || {},
        );

        const session: EdoSessionInfo = (await auth.getExternalAuthData({
          ...authLookupParams,
          refresh: true,
          system: 'EDO',
        })) as EdoSessionInfo;

        if (!session) throw new UnauthorizedException('Failed EDO login!');

        const newConfig = response.config;

        newConfig.params.DNSID = session.token.dnsid;
        newConfig.headers['cookie'] = `auth_token=${session.token.authToken};`;
        newConfig.withCredentials = true;

        return http.axiosRef.request(newConfig);
      },

      function (error) {
        return Promise.reject(error);
      },
    );
  }
}
