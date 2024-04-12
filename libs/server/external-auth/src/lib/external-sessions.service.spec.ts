import { Test } from '@nestjs/testing';
import { ExternalSessionsService } from './external-sessions.service';
import { ExternalSessionInfo } from '../model/types/session';

const rsmSession1 = {
  system: 'RSM',
  userId: 1,
  orgId: 0,
  token: {
    rsmCookie: 'initialAuthToken',
  },
} as ExternalSessionInfo;

const rsmSession2 = {
  system: 'RSM',
  userId: 1,
  orgId: 0,
  token: {
    rsmCookie: 'updatedAuthToken',
  },
} as ExternalSessionInfo;

const edoSession1 = {
  system: 'EDO',
  userId: 1,
  orgId: 0,
  token: {
    dnsid: 'some-uuid',
    authToken: 'initialAuthToken',
  },
} as ExternalSessionInfo;

const edoSessionAnotherUser = {
  system: 'EDO',
  userId: 2,
  token: {
    dnsid: 'some-uuid',
    authToken: 'initialAuthToken',
  },
} as ExternalSessionInfo;

describe('External-session service', () => {
  let sessions: ExternalSessionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [ExternalSessionsService],
    }).compile();

    sessions = moduleRef.get<ExternalSessionsService>(ExternalSessionsService);
  });

  describe('setSession', () => {
    it('should create a new session', async () => {
      const testSession = rsmSession1;
      const result = sessions.setSession(testSession);
      const sessionsList = sessions.getAllSessions();

      expect(result).toEqual({ ...testSession, createdAt: expect.any(Date) });
      expect(sessionsList).toHaveLength(1);
      expect(sessionsList[0]).toEqual({
        ...testSession,
        createdAt: expect.any(Date),
      });
    });

    it('should update a session for the same user and system', async () => {
      const initialSession = rsmSession1;
      const updatedSession = rsmSession2;

      sessions.setSession(initialSession);
      sessions.setSession(updatedSession);
      const sessionsList = sessions.getAllSessions();

      expect(sessionsList).toHaveLength(1);
      expect(sessionsList[0]).toEqual({
        ...updatedSession,
        createdAt: expect.any(Date),
      });
    });
    it('should create different sessions for different systems', async () => {
      const rsmSession = rsmSession1;
      const edoSession = edoSession1;

      sessions.setSession(rsmSession);
      sessions.setSession(edoSession);
      const sessionsList = sessions.getAllSessions();

      expect(sessionsList).toHaveLength(2);
      expect(sessionsList[0]).toEqual({
        ...rsmSession,
        createdAt: expect.any(Date),
      });
      expect(sessionsList[1]).toEqual({
        ...edoSession,
        createdAt: expect.any(Date),
      });
    });
  });
  describe('getSession', () => {
    it('should return correct session by system and user', async () => {
      const correctSession = edoSession1;
      const wrongSession = edoSessionAnotherUser;

      sessions.setSession(correctSession);
      sessions.setSession(wrongSession);

      const correctResult = sessions.getSession({
        system: correctSession.system,
        userId: correctSession.userId,
      });

      const emptySearch = sessions.getSession({
        system: 'RSM',
        userId: correctSession.userId,
      });

      expect(correctResult).toEqual({
        ...correctSession,
        createdAt: expect.any(Date),
      });
      expect(emptySearch).toBeUndefined;
    });
  });
  describe('deleteAllSessions', () => {
    it('should delete sessions of a specific system or all of them accordingly', async () => {
      sessions.setSession(rsmSession1);
      sessions.setSession(edoSession1);

      sessions.deleteAllSessions('EDO');

      expect(sessions.getAllSessions('EDO')).toHaveLength(0);
      expect(sessions.getAllSessions('RSM')).toHaveLength(1);

      sessions.deleteAllSessions();

      expect(sessions.getAllSessions()).toHaveLength(0);
    });
  });
});
