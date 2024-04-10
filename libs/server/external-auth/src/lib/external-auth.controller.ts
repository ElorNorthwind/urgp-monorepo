import { Controller, Get } from '@nestjs/common';
import { ExternalLoginService } from './external-login.service';
import { Observable } from 'rxjs';
import { EdoTokenData, RsmTokenData } from '../model/types/token';

@Controller('ext/auth/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(private readonly auth: ExternalLoginService) {}

  @Get('edo')
  getEdoToken(): Observable<EdoTokenData> {
    return this.auth.getEdoToken({
      userid: Number(process.env['EDO_DEFAULT_USERID']),
      password: process.env['EDO_DEFAULT_PASSWORD'] || '',
    });
  }
  @Get('rsm')
  getRsmToken(): Promise<RsmTokenData> {
    return this.auth.getRsmToken({
      login: process.env['RSM_LOGIN'] || '',
      password: process.env['RSM_PASSWORD'] || '',
    });
  }
}
