import { Controller, Get } from '@nestjs/common';
import { ExternalTokenService } from './external-token.service';
import { Observable } from 'rxjs';
import { EdoTokenData, RsmTokenData } from '../model/types/token';

@Controller('ext/auth/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(private readonly auth: ExternalTokenService) {}

  @Get('edo')
  getEdoToken(): Observable<EdoTokenData> {
    return this.auth.getExternalToken({
      system: 'EDO',
      credentials: {
        login: process.env['EDO_DEFAULT_USERID'] || '',
        password: process.env['EDO_DEFAULT_PASSWORD'] || '',
      },
    }) as Observable<EdoTokenData>;
  }
  @Get('rsm')
  getRsmToken(): Observable<RsmTokenData> {
    return this.auth.getExternalToken({
      system: 'RSM',
      credentials: {
        login: process.env['RSM_LOGIN'] || '',
        password: process.env['RSM_PASSWORD'] || '',
      },
    }) as Observable<RsmTokenData>;
  }
}
