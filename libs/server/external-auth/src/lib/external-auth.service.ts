import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExternalTokenService } from './external-token.service';
import { firstValueFrom } from 'rxjs';
import { ExternalSessionsService } from './external-sessions.service';
import { DatabaseService } from '@urgp/server/database';
import {
  AuthRequestDto,
  ExternalCredentials,
  ExternalSessionInfo,
  ExternalSessionReturnValue,
  FindSessionDto,
  authRequestDto,
  findSessionDto,
} from '@urgp/server/entities';

@Injectable()
export class ExternalAuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly tokenService: ExternalTokenService,
    private readonly sessions: ExternalSessionsService,
  ) {}

  getExternalCredentials(dto: FindSessionDto): Promise<ExternalCredentials> {
    const parsedDto = findSessionDto.parse(dto);
    return this.database.db.users.credentials(parsedDto);
  }

  async getExternalAuthData(
    dto: AuthRequestDto,
  ): Promise<ExternalSessionReturnValue> {
    const { system, userId, orgId, refresh, login, password, name } =
      authRequestDto.parse(dto);

    // check if there is an existing session and if a flag to refresh it is not send
    const existingSession =
      refresh === true
        ? undefined
        : this.sessions.getSession({ system, userId, orgId });

    // return a session if it is found
    if (existingSession)
      return {
        ...existingSession,
        isOld: true,
      };

    // no existing session found or there is a flag to refresh it
    const credentials =
      login && password && userId // use client credentials if provided
        ? { login, password, userId, orgId, name }
        : await this.getExternalCredentials({
            system,
            userId,
            orgId,
          });

    if (!credentials?.login || !credentials?.password)
      throw new HttpException(
        `No ${system} credentials found for user ${userId} (${credentials?.name || 'Unnamed'})`,
        HttpStatus.UNAUTHORIZED,
      );

    // get a fresh external token object
    const token = await firstValueFrom(
      this.tokenService.getExternalToken({
        system,
        ...credentials,
      } as ExternalCredentials),
    );

    // save the fresh session
    const freshSession = this.sessions.setSession({
      system,
      userId,
      orgId: credentials.orgId || [orgId],
      token,
    } as ExternalSessionInfo);

    return { ...freshSession, isOld: false };
  }
}
