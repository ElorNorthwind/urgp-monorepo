import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  CaseSlim,
  CaseCreateDto,
  CaseUpdateDto,
  ApproveControlEntityDto,
  GET_DEFAULT_CONTROL_DUE_DATE,
  SlimCaseSelector,
  FullCaseSelector,
  CaseFull,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';
import { ControlOperationsService } from './control-operations.service';
import { ControlClassificatorsService } from './control-classificators.service';

@Injectable()
export class ControlCaseService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly operations: ControlOperationsService,
    private readonly classificators: ControlClassificatorsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async createCase(
    dto: CaseCreateDto,
    userId: number,
    approved: boolean,
  ): Promise<CaseFull> {
    const createdCase: CaseSlim =
      await this.dbServise.db.controlCases.createCase(dto, userId, approved);
    this.operations.createReminderForAuthor(createdCase, userId, dto.dueDate);

    return this.dbServise.db.controlCases.readFullCase(
      createdCase.id,
      userId,
    ) as Promise<CaseFull>;
  }

  public async readSlimCase(
    selector: SlimCaseSelector,
  ): Promise<CaseSlim[] | CaseSlim> {
    return this.dbServise.db.controlCases.readSlimCase(selector);
  }

  public async readFullCase(
    selector: FullCaseSelector,
    userId: number,
  ): Promise<CaseFull[] | CaseFull> {
    return this.dbServise.db.controlCases.readFullCase(selector, userId);
  }

  public async updateCase(
    dto: CaseUpdateDto,
    userId: number,
  ): Promise<CaseFull> {
    const updatedCase = await this.dbServise.db.controlCases.updateCase(
      dto,
      userId,
    );
    return this.dbServise.db.controlCases.readFullCase(
      updatedCase.id,
      userId,
    ) as Promise<CaseFull>;
  }

  public async deleteCase(id: number, userId: number): Promise<CaseFull> {
    const deletedCase = await this.dbServise.db.controlCases.deleteCase(
      id,
      userId,
    );
    return this.dbServise.db.controlCases.readFullCase(
      deletedCase.id,
      userId,
    ) as Promise<CaseFull>;
  }

  public async approveCase(
    dto: ApproveControlEntityDto,
    userId: number,
    newApproverId: number | null,
  ): Promise<CaseFull> {
    const approvedCase = await this.dbServise.db.controlCases.approveCase(
      dto,
      userId,
      newApproverId,
    );

    if (dto.approveStatus === 'approved') {
      this.operations.createDispatchesAndReminderForCase(
        approvedCase,
        userId,
        dto.dueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
      );
    }

    return this.dbServise.db.controlCases.readFullCase(
      approvedCase.id,
      userId,
    ) as Promise<CaseFull>;
  }
}
