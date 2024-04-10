import { Injectable } from '@nestjs/common';
import { EdoSessionInfo, ExternalSessionInfo } from '../model/types/session';
import {
  ExternalSystem,
  GetCredentialsDto,
  getCredentials,
} from '@urgp/server/database';

@Injectable()
export class ExternalSessionService {
  // Возможно это надо хранить не в памяти, а где-нибудь в Reddis
  private externalSessions: ExternalSessionInfo[] = [];

  setSession({ userId, orgId, system, token }: ExternalSessionInfo) {
    const newSession = {
      ...getCredentials.parse({
        system,
        userId,
        orgId,
      }),
      token,
      createdAt: new Date(),
    };

    this.externalSessions = [
      ...this.externalSessions.filter(
        (session) => session.userId !== userId || session.system !== system,
      ),
      newSession as EdoSessionInfo,
    ];

    return newSession;
  }

  getSession(dto: GetCredentialsDto) {
    const { system, userId, orgId } = dto; // dedided to parse it higher up in the chain... getCredentials.parse(dto);
    return this.externalSessions.find((session) => {
      session.system === system &&
        (session.userId === userId || (!userId && session.orgId === orgId));
    });
  }

  getAllSessions(system?: ExternalSystem): ExternalSessionInfo[] {
    if (system)
      return this.externalSessions.filter(
        (session) => session.system === system,
      );
    return this.externalSessions;
  }

  deleteAllSessions(system?: ExternalSystem) {
    if (system) {
      this.externalSessions = [
        ...this.externalSessions.filter((session) => session.system !== system),
      ];
    } else {
      this.externalSessions = [];
    }
  }
}
