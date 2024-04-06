import { Module, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { EdoHttpService } from './http.service';
import { EDO_HTTP_OPTIONS } from './constants';
import { EdoAuthService } from './auth.service';
import { EdoApiController } from './api.controller';
import { EdoSessionService } from './session.service';
import * as iconv from 'iconv-lite';
import { ClsService } from 'nestjs-cls';
import { EdoClsStore, EdoClsStoreTemp } from './types';

@Module({
  imports: [HttpModule.register(EDO_HTTP_OPTIONS)],
  providers: [
    {
      provide: EdoHttpService,
      useExisting: HttpService,
    },
    EdoSessionService,
    EdoAuthService,
  ],
  controllers: [EdoApiController],
  exports: [EdoHttpService],
})
export class EdoApiModule implements OnModuleInit {
  constructor(
    private readonly httpService: EdoHttpService,
    private readonly cls: ClsService<EdoClsStoreTemp>,
    private readonly auth: EdoAuthService,
  ) {}

  onModuleInit() {
    const cls = this.cls;
    const auth = this.auth;
    const http = this.httpService;
    // request interceptor
    http.axiosRef.interceptors.request.use(
      async function (config) {
        // Пропускаем запросы, сделанные в адрес страницы авторизации
        if (config?.url?.includes('auth.php')) {
          return config;
        }

        const { groupid, uprid, userid, password } = config?.params || {};

        cls.set('edo.groupid', groupid);
        cls.set('edo.uprid', uprid);
        cls.set('edo.userid', userid);
        cls.set('edo.password', password);

        const session = await auth.login({
          groupid,
          uprid,
          userid,
          password,
        });

        if (!session) throw new UnauthorizedException('Failed EDO login!');

        config.params.groupid = undefined;
        config.params.uprid = undefined;
        config.params.userid = undefined;
        config.params.password = undefined;

        config.params.DNSID = session.dnsid;
        config.headers['cookie'] = `auth_token=${session.authToken};`;
        config.withCredentials = true;

        return config;
      },

      function (error) {
        return Promise.reject(error);
      },
    );

    // response interceptor
    http.axiosRef.interceptors.response.use(
      async function (response) {
        // автоматически рекодируем эту шляпу
        const ctype = response.headers['content-type'];
        if (ctype.includes('charset=windows-1251')) {
          response.data = iconv.decode(Buffer.from(response.data), 'win1251');
        }

        // Пропускаем ответы по запросам, которые:
        if (
          response?.config?.url?.includes('auth.php') || // уходили к странице авторизации
          !response.request?.res?.responseUrl?.includes('auth.php') || // не были перенаправлены на страницу авторизации
          cls.get('edo.sessionIsNew') // уже сделаны со "свежей" авторизацией, а не данными ранее сохранённой сессии
        ) {
          return response;
        }

        const groupid = cls.get('edo.groupid');
        const uprid = cls.get('edo.uprid');
        const userid = cls.get('edo.userid');
        const password = cls.get('edo.password');

        const session = await auth.login({
          groupid,
          uprid,
          userid,
          password,
          forceNewSession: true,
        });

        if (!session) throw new UnauthorizedException('Failed EDO login!');

        const newConfig = response.config;

        newConfig.params.DNSID = session.dnsid;
        newConfig.headers['cookie'] = `auth_token=${session.authToken};`;
        newConfig.withCredentials = true;

        return http.axiosRef.request(newConfig);
      },

      function (error) {
        return Promise.reject(error);
      },
    );
  }
}
