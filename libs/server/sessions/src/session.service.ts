import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  EdoSessionInfo,
  ExternalSessionInfo,
  RsmSessionInfo,
  ExternalSystem,
} from './model/types';

@Injectable()
export class EdoSessionService {
  // Возможно это надо хранить не в памяти, а где-нибудь в Reddis
  private edoSessions: EdoSessionInfo[] = [];
  private rsmSessions: RsmSessionInfo[] = [];

  setSession({ userId, orgId, system, credentials }: ExternalSessionInfo) {
    const newSession = {
      userId,
      system,
      orgId,
      credentials,
      createdAt: new Date(),
    };

    switch (system) {
      case 'EDO':
        this.edoSessions = [
          ...this.edoSessions.filter((session) => session.userId !== userId),
          newSession as EdoSessionInfo,
        ];
        break;
      case 'RSM':
        this.rsmSessions = [
          ...this.rsmSessions.filter((session) => session.userId !== userId),
          newSession as RsmSessionInfo,
        ];
        break;
      default:
        throw new HttpException(
          'Unknown external system!',
          HttpStatus.BAD_REQUEST,
        );
    }
    return newSession;
  }

  getSession({
    userId,
    orgId,
    system,
  }: {
    userId?: number;
    orgId: number;
    system: ExternalSystem;
  }) {
    let sessions: ExternalSessionInfo[] = [];
    let defaultUser: number;
    switch (system) {
      case 'EDO':
        sessions = this.edoSessions;
        defaultUser = Number(process.env['EDO_DEFAULT_USERID']);
        break;
      case 'RSM':
        sessions = this.rsmSessions;
        defaultUser = Number(process.env['RSM_DEFAULT_USERID']);
        break;
      default:
        throw new HttpException(
          'Unknown external system',
          HttpStatus.BAD_REQUEST,
        );
    }

    if (userId) {
      return sessions.find((session) => session.userId === userId);
    } else if (orgId) {
      return sessions.find((session) => session.orgId === orgId);
    } else if (defaultUser) {
      return sessions.find((session) => session.userId === defaultUser);
    } else {
      throw new HttpException(
        'No user set and public account unavaliable',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getAllSessions(system: ExternalSystem): ExternalSessionInfo[] {
    switch (system) {
      case 'EDO':
        return this.edoSessions;
        break;
      case 'RSM':
        return this.rsmSessions;
        break;
      default:
        throw new HttpException(
          'Unknown external system',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  deleteAllSessions(system: ExternalSystem) {
    switch (system) {
      case 'EDO':
        this.edoSessions = [];
        break;
      case 'RSM':
        this.rsmSessions = [];
        break;
      default:
        throw new HttpException(
          'Unknown external system',
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}
