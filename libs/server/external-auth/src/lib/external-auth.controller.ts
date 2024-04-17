import { Controller, Get } from '@nestjs/common';
import { ExternalAuthService } from './external-auth.service';
import { AuthRequestDto, ExternalSessionInfo } from '@urgp/server/entities';

@Controller('ext/auth/') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class ExternalAuthController {
  constructor(private readonly auth: ExternalAuthService) {}

  @Get('edo')
  getEdoToken(): Promise<ExternalSessionInfo> {
    return this.auth.getExternalAuthData({
      system: 'EDO',
      userId: 22,
      orgId: 0,
    } as AuthRequestDto);
  }

  @Get('rsm')
  getRsmToken(): Promise<ExternalSessionInfo> {
    return this.auth.getExternalAuthData({
      system: 'RSM',
      userId: 10,
      orgId: 0,
    } as AuthRequestDto);
  }
}
