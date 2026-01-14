import {
  Logger,
  Module,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { EDO_HTTP_OPTIONS } from '../config/constants';
import { SudirModule } from '@urgp/server/sudir';
import { EdoRequestsService } from './edo-requests.service';
import { EdoController } from './edo.controller';
import * as iconv from 'iconv-lite';
import { SudirService } from 'libs/server/sudir/src/lib/sudir.service';
import { firstValueFrom } from 'rxjs';
import { InternalAxiosRequestConfig } from 'axios';
import { EdoAxiosRequestConfig } from '../model/types';
import { EdoService } from './edo.service';

@Module({
  imports: [HttpModule.register(EDO_HTTP_OPTIONS), SudirModule],
  providers: [EdoRequestsService, EdoService],
  controllers: [EdoController],
  exports: [EdoService],
})
export class EdoModule implements OnModuleInit {
  constructor(
    private readonly axios: HttpService,
    private readonly sudir: SudirService,
  ) {}
  onModuleInit() {
    const sudir = this.sudir;
    // const axios = this.axios;

    // request interceptor
    this.axios.axiosRef.interceptors.request.use(
      async function (config) {
        const { edoUserId } = config as EdoAxiosRequestConfig;

        const credentials = await sudir.loginEdoOrMasterUser(edoUserId);

        if (
          !credentials ||
          !credentials.DNSID ||
          !credentials.authCode ||
          credentials.DNSID === ''
        ) {
          throw new UnauthorizedException('Failed to login EDO user!');
        }

        config.params.DNSID = credentials.DNSID;
        config.headers['cookie'] = credentials.authCode;
        config.withCredentials = true;

        return config;
      },

      function (error) {
        return Promise.reject(error);
      },
    );

    // response interceptor
    this.axios.axiosRef.interceptors.response.use(async function (response) {
      // автоматически перекодируем win1251 ответы
      const ctype = response.headers['content-type'];
      if (ctype.includes('charset=windows-1251')) {
        response.data = iconv.decode(Buffer.from(response.data), 'win1251');
      } else {
        response.data = iconv.decode(Buffer.from(response.data), 'utf-8');
      }

      return response;
    });
  }
}
