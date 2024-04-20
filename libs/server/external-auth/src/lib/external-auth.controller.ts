import { Controller, Get } from '@nestjs/common';
import { ExternalAuthService } from './external-auth.service';
import { ExternalSessionInfo } from '@urgp/server/entities';
import { ExternalSessionsService } from './external-sessions.service';

@Controller('ext/auth/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(
    private readonly sessions: ExternalSessionsService,
    private readonly auth: ExternalAuthService,
  ) {}

  @Get('edo')
  getEdoToken(): Promise<ExternalSessionInfo> {
    return this.auth.getExternalAuthData({ lookup: { system: 'EDO' } });
  }

  @Get('rsm')
  getRsmToken(): Promise<ExternalSessionInfo> {
    return this.auth.getExternalAuthData({ lookup: { system: 'RSM' } });
  }

  @Get('sessions')
  getSessionList(): ExternalSessionInfo[] {
    return this.sessions.getAllSessions();
  }
}
