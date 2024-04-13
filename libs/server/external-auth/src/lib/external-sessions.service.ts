import { Injectable } from '@nestjs/common';
import {
  ExternalSessionInfo,
  ExternalSystem,
  FindSessionDto,
  externalSessionInfo,
  findSessionDto,
} from '@urgp/server/entities';

@Injectable()
export class ExternalSessionsService {
  // Возможно это надо хранить не в памяти, а где-нибудь в Reddis
  private externalSessions: ExternalSessionInfo[] = [];

  setSession(sessiotInfo: ExternalSessionInfo) {
    const newSession = externalSessionInfo.parse(sessiotInfo);

    this.externalSessions = [
      ...this.externalSessions.filter(
        (session) =>
          session.userId !== newSession.userId ||
          session.system !== newSession.system,
      ),
      newSession as ExternalSessionInfo,
    ];

    return newSession;
  }

  getSession(dto: FindSessionDto) {
    const { system, userId, orgId } = findSessionDto.parse(dto);
    return this.externalSessions.find((session) => {
      return (
        session.system === system &&
        (session.userId === userId || (!userId && session.orgId === orgId))
      );
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
