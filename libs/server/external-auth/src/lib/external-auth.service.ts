import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  DatabaseService,
  DbExternalCredentials,
  GetCredentialsDto,
  getCredentials,
} from '@urgp/server/database';
import {
  ExternalAuthData,
  ExternalAuthDataRequest,
} from '../model/types/token';
import { ExternalTokenService } from './external-token.service';
import { firstValueFrom } from 'rxjs';
import { ExternalSessionsService } from './external-sessions.service';
import { ExternalSessionInfo } from '../model/types/session';

@Injectable()
export class ExternalAuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly tokenService: ExternalTokenService,
    private readonly sessions: ExternalSessionsService,
  ) {}

  getExternalCredentials(
    dto: GetCredentialsDto,
  ): Promise<DbExternalCredentials> {
    return this.database.db.users.credentials(dto);
  }

  async getExternalAuthData(
    props: ExternalAuthDataRequest,
  ): Promise<ExternalAuthData> {
    const { system, userId, orgId } = getCredentials.parse(props);
    const { refresh, login, password } = props;

    // get existing session only if there is no flag to force a refresh of a session
    const session =
      refresh === true
        ? undefined
        : this.sessions.getSession({ system, userId, orgId });
    if (session) return { system, token: session.token, isOld: true };

    // no existing session found or there is a flag to refresh it
    const credentials =
      login && password && userId // use client credentials if provided
        ? { login, password, userId, orgId }
        : await this.getExternalCredentials({
            system,
            userId,
            orgId,
          });

    if (!credentials?.login || !credentials?.password)
      throw new HttpException(
        `No ${system} credentials found for user ${userId} (${credentials.name || 'Unnamed'})`,
        HttpStatus.UNAUTHORIZED,
      );

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
