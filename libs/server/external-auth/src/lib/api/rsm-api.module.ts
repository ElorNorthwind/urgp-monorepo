import {
  HttpException,
  HttpStatus,
  Module,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { RSM_HTTP_OPTIONS } from '../../config/request-config';
import { ExternalAuthService } from '../external-auth.service';
import { DatabaseModule } from '@urgp/server/database';
import { ExternalAuthModule } from '../external-auth.module';
import { ExternalTokenService } from '../external-token.service';
import { ExternalSessionsService } from '../external-sessions.service';
import { RsmHttpService } from './rsm-http-service';
import { RsmTestController } from './rsm-api.controller';

@Module({
  imports: [
    HttpModule.register(RSM_HTTP_OPTIONS),
    DatabaseModule,
    ExternalAuthModule,
  ],
  providers: [
    {
      provide: RsmHttpService,
      useExisting: HttpService,
    },
    ExternalAuthService,
    ExternalTokenService,
    ExternalSessionsService,
  ],
  exports: [RsmHttpService],
  controllers: [RsmTestController],
})
export class RsmApiModule implements OnModuleInit {
  constructor(
    private readonly auth: ExternalAuthService,
    private readonly httpService: RsmHttpService,
  ) {}

  onModuleInit() {
    const auth = this.auth;
    const http = this.httpService;

    // ========= request interceptor =========
    http.axiosRef.interceptors.request.use(
      async function (config) {
        // // Запросы на страницу авторизации? Вроде бы нет...
        // if (config?.url?.includes('sudir.mos.ru')) {
        //   return config;
        // }

        // default system to RSM
        config.params.x_external_auth = config.params.x_external_auth && {
          ...config.params.x_external_auth,
          lookup: { ...config.params?.x_external_auth?.lookup, system: 'RSM' },
        };

        const session = await auth.getExternalAuthData(
          config?.params?.x_external_auth || { lookup: { system: 'RSM' } },
        );

        // an ugy hack to typecast it to RsmSession
        if (session.system !== 'RSM')
          throw new HttpException('Unexpected system', HttpStatus.BAD_REQUEST);

        config.headers['cookie'] = `Rsm.Cookie=${session.token.rsmCookie};`;
        config.withCredentials = true;

        config.params.x_external_auth = {
          ...config.params.x_external_auth,
          refresh: !session.isFresh,
        };
        return config;
      },

      function (error) {
        return Promise.reject(error);
      },
    );

    // ========= response interceptor =========
    http.axiosRef.interceptors.response.use(
      async function (response) {
        // // автоматически рекодируем данные в UTF-8
        // const ctype = response.headers['content-type'];
        // if (ctype.includes('charset=windows-1251')) {
        //   response.data = iconv.decode(Buffer.from(response.data), 'win1251');
        // }

        // Пропускаем ответы по запросам, которые:
        if (
          //   response?.config?.url?.includes('auth.php') || // уходили к странице авторизации
          !response.request?.res?.responseUrl?.includes('sudir.mos.ru') || // не были перенаправлены на страницу авторизации
          response?.config?.params?.x_external_auth?.refresh === false // уже сделаны со "свежей" авторизацией, а не данными ранее сохранённой сессии
        ) {
          return response;
        }

        const session = await auth.getExternalAuthData({
          ...response?.config?.params?.x_external_auth,
          lookup: {
            ...response?.config?.params?.x_external_auth?.lookup,
            system: 'RSM',
          },
          refresh: true,
        });

        if (!session) throw new UnauthorizedException('Failed RSM login!');

        // an ugy hack to typecast it to EdoSession
        if (session.system !== 'RSM')
          throw new HttpException('Unexpected system', HttpStatus.BAD_REQUEST);

        const newConfig = response.config;

        newConfig.headers['cookie'] = `Rsm.Cookie=${session.token.rsmCookie};`;
        newConfig.withCredentials = true;

        return http.axiosRef.request(newConfig);
      },

      function (error) {
        return Promise.reject(error);
      },
    );
  }
}
