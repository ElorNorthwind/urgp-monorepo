import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExternalTokenService } from './external-token.service';
import { firstValueFrom } from 'rxjs';
import { ExternalSessionsService } from './external-sessions.service';
import { DatabaseService } from '@urgp/server/database';
import {
  ExternalAuthRequest,
  ExternalCredentials,
  ExternalFullSessionReturnValue,
  ExternalLookup,
  ExternalSessionInfo,
  externalAuthRequest,
  externalFullSession,
  externalLookup,
} from '@urgp/server/entities';

@Injectable()
export class ExternalAuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly tokenService: ExternalTokenService,
    private readonly sessions: ExternalSessionsService,
  ) {}

  getExternalCredentials(
    dto: ExternalLookup,
  ): Promise<ExternalCredentials & ExternalSessionInfo> {
    const parsedDto = externalLookup.parse(dto);
    return this.database.db.users.credentials(parsedDto);
  }

  async getExternalAuthData(
    dto: ExternalAuthRequest,
  ): Promise<ExternalFullSessionReturnValue> {
    const { lookup, credentials, refresh } = externalAuthRequest.parse(dto);

    // check if there is an existing session and if a flag to refresh it is not send
    const existingSession =
      refresh === true || !lookup
        ? undefined
        : this.sessions.getSession(lookup);

    // return an existing session if it is found
    if (existingSession)
      return {
        ...existingSession,
        isFresh: false,
      };

    // no existing session found or there is a flag to refresh it
    const {
      system = lookup?.system || 'EDO',
      userId = lookup?.userId || null,
      orgId = null,
      login,
      password,
      groupId = 21,
      name,
    } = credentials
      ? { ...credentials, userId: lookup?.userId || null }
      : await this.getExternalCredentials(lookup || {});

    // throw an error if no credentials are found
    if (!login || !password)
      throw new HttpException(
        `No ${lookup?.system || 'EDO'} credentials found for user ${lookup?.userId} (${credentials?.name || 'Unnamed'})`,
        HttpStatus.UNAUTHORIZED,
      );

    // get a fresh external token object
    const token = await firstValueFrom(
      this.tokenService.getExternalToken({
        login,
        password,
        groupId,
        system: lookup?.system,
      }),
    );

    const sessionObject = externalFullSession.parse({
      system,
      userId,
      orgId,
      token,
      credentials: { login, password, groupId, name },
    });

    // return without saving a session if it was created with client credentials but no userId
    if (!userId) return { ...sessionObject, isFresh: true };

    // save the fresh session otherwise
    const freshSession = this.sessions.setSession(sessionObject);
    return { ...freshSession, isFresh: true };
  }
}
