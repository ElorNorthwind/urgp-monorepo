import { Controller, Get } from '@nestjs/common';
import { ExternalTokenService } from './external-token.service';
import { Observable } from 'rxjs';
import { ExternalAuthService } from './external-auth.service';
import {
  ExternalSessionReturnValue,
  RsmSessionInfo,
} from '@urgp/server/entities';

@Controller('ext/auth/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(
    private readonly token: ExternalTokenService,
    private readonly auth: ExternalAuthService,
  ) {}

  @Get('edo')
  getEdoToken(): Promise<ExternalSessionReturnValue> {
    return this.auth.getExternalAuthData({
      system: 'EDO',
      userId: 22,
      orgId: 0,
    });
  }

  @Get('rsm')
  getRsmToken(): Promise<ExternalSessionReturnValue> {
    return this.auth.getExternalAuthData({
      system: 'RSM',
      userId: 10,
      orgId: 0,
    });
  }
}
