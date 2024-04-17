import { Controller, Get } from '@nestjs/common';
import { ExternalAuthService } from './external-auth.service';
import { ExternalSessionInfo } from '@urgp/server/entities';

@Controller('ext/auth/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(private readonly auth: ExternalAuthService) {}

  @Get('edo')
  getEdoToken(): Promise<ExternalSessionInfo> {
    return this.auth.getExternalAuthData({ lookup: { system: 'EDO' } });
  }

  @Get('rsm')
  getRsmToken(): Promise<ExternalSessionInfo> {
    return this.auth.getExternalAuthData({ lookup: { system: 'RSM' } });
  }
}
