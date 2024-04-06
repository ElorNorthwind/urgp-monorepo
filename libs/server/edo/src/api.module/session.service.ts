import { Injectable } from '@nestjs/common';
import {
  EdoSession,
  EdoSessionAuthData,
  EdoSessonLookupRequest,
} from './types';

@Injectable()
export class EdoSessionService {
  // Возможно это надо хранить не в памяти, а где-нибудь в Reddis
  private sessions: EdoSession[] = [];

  setSession({ userid, dnsid, authToken }: EdoSessionAuthData): EdoSession {
    const newSession = { userid, dnsid, authToken, createdAt: new Date() };
    this.sessions = [
      ...this.sessions.filter((session) => session.userid !== userid),
      newSession,
    ];
    return newSession;
  }

  getSession(requestData?: EdoSessonLookupRequest) {
    const { uprid, userid } = requestData || {};

    if (userid) {
      return this.sessions.find((session) => session.userid === userid);
    }

    if (uprid && uprid !== process.env.EDO_DEFAULT_UPR) {
      return undefined; // НУЖНО ИМПЛЕМЕНТИРОВАТЬ! Запрос к БД на получение дефолтного юзера для кнкретного Управления, а не хрен моржовый
    }

    return this.sessions.find(
      (session) => session.userid === process.env.EDO_DEFAULT_USERID,
    );
  }

  getAllSessions(): EdoSession[] {
    return this.sessions || [];
  }

  deleteAllSessions() {
    this.sessions = [];
  }
}
