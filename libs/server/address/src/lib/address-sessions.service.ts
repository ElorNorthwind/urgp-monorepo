import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import {
  AddressSession,
  AddressSessionFull,
  CreateAddressSessionDto,
  UpdateAddressSessionDto,
} from '@urgp/shared/entities';
import { AddressService } from './address.service';

@Injectable()
export class AddressSessionsService {
  private sessionQueue: AddressSessionFull[] = [];
  constructor(
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
    private readonly address: AddressService,
  ) {}

  public getActiveSession(): AddressSessionFull[] {
    return this.sessionQueue;
  }

  public async refreshSessionQueue(): Promise<void> {
    const sessions = await this.dbServise.db.address.getSessionQueue();
    const runningSessions = this.sessionQueue.filter(
      (s) => s.status === 'running',
    );

    const activeSessions = sessions
      .filter((s) => runningSessions.some((rs) => rs.id === s.id))
      .map((s) => ({ ...s, status: 'running' }));
    const inactiveSessions = sessions.filter(
      (s) => !runningSessions.some((rs) => rs.id === s.id),
    );
    if (runningSessions.length > 1)
      Logger.warn(`Running sessions: ${sessions}! (that's not ok)`);
    this.sessionQueue = [...activeSessions, ...inactiveSessions];
    this.startSessionsQueue();
  }

  public async startSessionsQueue(): Promise<void> {
    if (
      this.sessionQueue.length === 0 ||
      this.sessionQueue[0].status === 'running'
    )
      return;

    try {
      this.sessionQueue[0].status = 'running';
      await this.address.hydrateSessionAdresses(this.sessionQueue[0].id);
      this.sessionQueue[0].status = 'done';
    } catch (error) {
      this.sessionQueue[0].status = 'error';
      Logger.error(error);
    } finally {
      this.refreshSessionQueue();
      // this.startSessionsQueue();
    }
  }

  public async createSession(
    dto: CreateAddressSessionDto,
    userId: number,
  ): Promise<number> {
    const session = await this.dbServise.db.address.insertSession(dto, userId);
    this.refreshSessionQueue();
    // this.startSessionsQueue();
    return session;
  }

  public async resetSessionErrors(id: number): Promise<void> {
    await this.dbServise.db.address.resetSessionErrors(id);
    this.refreshSessionQueue();
    // this.startSessionsQueue();
  }

  public async updateSession(
    dto: UpdateAddressSessionDto,
  ): Promise<AddressSession> {
    const session = await this.dbServise.db.address.updateSession(dto);
    this.refreshSessionQueue();
    // this.startSessionsQueue();
    return session;
  }

  public async getSessionById(id: number): Promise<AddressSession | null> {
    this.startSessionsQueue();
    const session = await this.dbServise.db.address.getSessionById(id);
    if (!session) return null;
    return {
      ...session,
      status:
        this.sessionQueue.find((s) => s.id === id)?.status || session?.status,
    };
  }

  public async getSessionsByUserId(userId: number): Promise<AddressSession[]> {
    this.startSessionsQueue();
    const sessions =
      await this.dbServise.db.address.getSessionsByUserId(userId);
    return sessions.map((s) => ({
      ...s,
      status:
        this.sessionQueue.find((ss) => ss.id === s.id)?.status || s.status,
    }));
  }

  public async deleteSession(id: number): Promise<null> {
    await this.dbServise.db.address.deleteSession(id);
    this.refreshSessionQueue();
    // this.startSessionsQueue();
    return null;
  }

  public async deleteSessionsOlderThan(date: string): Promise<null> {
    await this.dbServise.db.address.deleteSessionsOlderThan(date);
    this.refreshSessionQueue();
    this.startSessionsQueue();
    return null;
  }
}
