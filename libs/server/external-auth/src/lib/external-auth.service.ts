import { Injectable } from '@nestjs/common';
import {
  DatabaseService,
  DbExternalCredentials,
  GetCredentialsDto,
  getCredentials,
} from '@urgp/server/database';
import { EternalAuthData } from '../model/types/token';
import { ExternalTokenService } from './external-token.service';
import { firstValueFrom } from 'rxjs';
import { ExternalSessionService } from './external-session.service';
import { ExternalSessionInfo } from '../model/types/session';

@Injectable()
export class ExternalAuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly tokenService: ExternalTokenService,
    private readonly sessions: ExternalSessionService,
  ) {}

  getExternalCredentials(
    dto: GetCredentialsDto,
  ): Promise<DbExternalCredentials> {
    return this.database.db.users.credentials(dto);
  }

  async getExternalAuthData(
    dto: GetCredentialsDto,
    refresh = false,
  ): Promise<EternalAuthData> {
    const { system, userId, orgId } = getCredentials.parse(dto);

    // get existing session only if there is no flag to force a refresh of a session
    const session = refresh
      ? undefined
      : this.sessions.getSession({ system, userId, orgId });

    if (session) return { system, token: session.token, isOld: true };

    // no existing session found or there is a flag to refresh it
    const credentials = await this.getExternalCredentials({
      system,
      userId,
      orgId,
    });

    // get a fresh external token object
    const token = await firstValueFrom(
      this.tokenService.getExternalToken({
        system,
        credentials,
      }),
    );

    // save the fresh session
    this.sessions.setSession({
      system,
      userId: credentials.userId,
      orgId: credentials.orgId,
      token,
    } as ExternalSessionInfo);

    return { system, token, isOld: false };
  }
}
