import { Controller, Get } from '@nestjs/common';
import { ExternalAuthService } from './external-auth.service';
import { Observable } from 'rxjs';
import { EdoAccessData } from '@urgp/server/sessions';

@Controller('ext/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(private readonly auth: ExternalAuthService) {}

  @Get('auth')
  getAuthToken(): Observable<EdoAccessData> {
    return this.auth.getEdoAccessData({
      userid: Number(process.env['EDO_DEFAULT_USERID']),
      password: process.env['EDO_DEFAULT_PASSWORD'] || '',
    });
  }
}
