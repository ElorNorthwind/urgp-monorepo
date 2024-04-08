import { Controller, Get } from '@nestjs/common';
import { ExternalAuthService } from './external-auth.service';
import { Observable } from 'rxjs';

@Controller('ext/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(private readonly auth: ExternalAuthService) {}

  @Get('dnsid')
  getDnsid(): Observable<string> {
    return this.auth.getDnsid();
  }
}
