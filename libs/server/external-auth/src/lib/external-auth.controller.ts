import { Controller, Get } from '@nestjs/common';
import { ExternalAuthService } from './external-auth.service';
import { Observable, firstValueFrom } from 'rxjs';

@Controller('ext/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(private readonly auth: ExternalAuthService) {}

  @Get('dnsid')
  getDnsid(): Observable<string> {
    return this.auth.getDnsid();
  }
  @Get('auth')
  async getAuthToken(): Promise<string> {
    const dnsid = await firstValueFrom(this.auth.getDnsid());
    return firstValueFrom(
      this.auth.getAuthToken({
        dnsid,
        userid: Number(process.env['EDO_DEFAULT_USERID']),
        password: process.env['EDO_DEFAULT_PASSWORD'] || '',
      }),
    );
  }
}
