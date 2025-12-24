import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { EDO_HTTP_OPTIONS } from '../config/constants';
import { SudirModule } from '@urgp/server/sudir';
import { EdoRequestsService } from './edo-requests.service';
import { EdoController } from './edo.controller';
import * as iconv from 'iconv-lite';

@Module({
  imports: [HttpModule.register(EDO_HTTP_OPTIONS), SudirModule],
  providers: [EdoRequestsService],
  controllers: [EdoController],
  exports: [EdoRequestsService],
})
export class EdoModule implements OnModuleInit {
  constructor(private readonly axios: HttpService) {}
  onModuleInit() {
    // response interceptor
    this.axios.axiosRef.interceptors.response.use(async function (response) {
      // автоматически перекодируем win1251 ответы
      const ctype = response.headers['content-type'];
      if (ctype.includes('charset=windows-1251')) {
        response.data = iconv.decode(Buffer.from(response.data), 'win1251');
      }
      return response;
    });
  }
}
