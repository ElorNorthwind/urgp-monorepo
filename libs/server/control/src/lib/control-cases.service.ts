import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  CaseSlim,
  CaseCreateDto,
  CaseUpdateDto,
  Case,
  UserControlData,
  UserInputApproveDto,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';

@Injectable()
export class ControlCaseService {
  constructor(
    private readonly dbServise: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async createCase(
    dto: CaseCreateDto,
    userId: number,
    approved: boolean,
  ): Promise<Case> {
    const createdCase = await this.dbServise.db.controlCases.createCase(
      dto,
      userId,
      approved,
    );
    return this.dbServise.db.controlCases.readFullCaseById(
      createdCase.id,
    ) as Promise<Case>;
  }

  public async readSlimCaseById(id: number): Promise<CaseSlim> {
    return this.dbServise.db.controlCases.readSlimCaseById(id);
  }

  public async readCases(userId: number): Promise<Case[]> {
    return this.dbServise.db.controlCases.readCases(userId);
  }

  public async updateCase(dto: CaseUpdateDto, userId: number): Promise<Case> {
    const updatedCase = await this.dbServise.db.controlCases.updateCase(
      dto,
      userId,
    );
    return this.dbServise.db.controlCases.readFullCaseById(
      updatedCase.id,
    ) as Promise<Case>;
  }

  public async deleteCase(id: number, userId: number): Promise<Case> {
    const deletedCase = await this.dbServise.db.controlCases.deleteCase(
      id,
      userId,
    );
    return this.dbServise.db.controlCases.readFullCaseById(
      deletedCase.id,
    ) as Promise<Case>;
  }

  public async approveCase(
    dto: UserInputApproveDto,
    userId: number,
    newApprover: number | null,
  ): Promise<Case> {
    const approvedCase = await this.dbServise.db.controlCases.approveCase(
      dto,
      userId,
      newApprover,
    );
    return this.dbServise.db.controlCases.readFullCaseById(
      approvedCase.id,
    ) as Promise<Case>;
  }
}
