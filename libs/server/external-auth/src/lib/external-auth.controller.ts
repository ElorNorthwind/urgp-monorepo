import { Controller, Get } from '@nestjs/common';
import { ExternalLoginService } from './external-login.service';
import { Observable } from 'rxjs';
import { EdoTokenData } from '@urgp/server/sessions';

@Controller('ext/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(private readonly auth: ExternalLoginService) {}

  @Get('auth')
  getAuthToken(): Observable<EdoTokenData> {
    return this.auth.getEdoToken({
      userid: Number(process.env['EDO_DEFAULT_USERID']),
      password: process.env['EDO_DEFAULT_PASSWORD'] || '',
    });
  }
}
