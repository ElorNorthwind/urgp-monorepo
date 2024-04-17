import { Injectable } from '@nestjs/common';
import {
  ExternalFullSession,
  ExternalFullSessionInput,
  ExternalLookup,
  ExternalSystem,
  externalFullSession,
  externalLookup,
} from '@urgp/server/entities';

@Injectable()
export class ExternalSessionsService {
  // Возможно это надо хранить не в памяти, а где-нибудь в Reddis
  private externalSessions: ExternalFullSession[] = [];

  setSession(session: ExternalFullSessionInput) {
    const newSession = externalFullSession.parse(session);

    this.externalSessions = [
      ...this.externalSessions.filter(
        (session) =>
          session.userId !== newSession.userId ||
          session.system !== newSession.system,
      ),
      newSession,
    ];

    return newSession;
  }

  getSession(dto: ExternalLookup) {
    const { system, userId, orgId } = externalLookup.parse(dto);
    return this.externalSessions.find((session) => {
      return (
        session.system === system &&
        (session.userId === userId ||
          (!userId && orgId && session.orgId?.includes(orgId)))
      );
    });
  }

  getAllSessions(system?: ExternalSystem): ExternalFullSession[] {
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
