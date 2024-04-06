import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { EdoAuthService } from './auth.service';
import { EdoSessionService } from './session.service';
import { EdoSession } from './types';
import { EdoHttpService } from './http.service';

@Controller('edo/api') // ЭТОТ КОНТРОЛЛЕР НА САМОМ ДЕЛЕ НЕ НУЖЕН, ЧИСТО ТЕСТ ПАЦАНЫ
export class EdoApiController {
  constructor(
    private readonly auth: EdoAuthService,
    private readonly session: EdoSessionService,
    private readonly http: EdoHttpService,
  ) {}

  @Get('login')
  async login(
    @Param('userid') userid?: string,
    @Param('groupid') groupid?: string,
    @Param('uprid') uprid?: string,
    @Param('password') password?: string,
  ): Promise<EdoSession> {
    return this.auth.login({
      groupid,
      uprid,
      userid,
      password,
      forceNewSession: true,
    });
  }

  @Get('sessions')
  getSessions(): EdoSession[] {
    return this.session.getAllSessions();
  }

  @Get('sessions/:userid')
  getSessionById(@Param('userid') userid: string): EdoSession | undefined {
    return this.session.getSession({ userid });
  }

  @Patch('sessions/:userid')
  fakeBadSessionById(@Param('userid') userid: string): EdoSession | undefined {
    return this.session.setSession({
      userid,
      dnsid: 'fateDNS',
      authToken: 'fakeToken',
    });
  }

  @Delete('sessions')
  deleteSessions(): void {
    this.session.deleteAllSessions();
  }
}
