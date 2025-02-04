import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  CaseSlim,
  ApproveControlEntityDto,
  GET_DEFAULT_CONTROL_DUE_DATE,
  SlimCaseSelector,
  FullCaseSelector,
  CaseFull,
  CreateCaseDto,
  UpdateCaseDto,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';
import { ControlOperationsService } from './control-operations.service';
import { ControlClassificatorsService } from './control-classificators.service';

@Injectable()
export class ControlCaseService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly operations: ControlOperationsService,
    // private readonly classificators: ControlClassificatorsService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async createCase(
    dto: CreateCaseDto,
    authorId: number,
  ): Promise<CaseFull> {
    const createdCaseId: number =
      await this.dbServise.db.controlCases.createCase(dto, authorId);

    // Напоминание автору
    this.operations.createReminderForAuthor(
      createdCaseId,
      authorId,
      dto?.dueDate,
    );

    // Напоминания и поручения исполнителям и подписавшимся
    if (dto.approveStatus === 'approved') {
      this.operations.createDispatchesAndReminderForCase(
        createdCaseId,
        authorId,
        dto?.dueDate,
      );
    }

    return this.dbServise.db.controlCases.readFullCase(
      createdCaseId,
      authorId,
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
    dto: UpdateCaseDto,
    updatedById: number,
  ): Promise<CaseFull> {
    const updatedCaseId = await this.dbServise.db.controlCases.updateCase(
      dto,
      updatedById,
    );

    if (dto.approveStatus === 'approved') {
      this.operations.createDispatchesAndReminderForCase(
        updatedCaseId,
        updatedById,
        dto?.dueDate,
      );
    }

    return this.dbServise.db.controlCases.readFullCase(
      updatedCaseId,
      updatedById,
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
  ): Promise<CaseFull> {
    const approvedCaseId = (await this.dbServise.db.controlCases.approveCase(
      dto,
      userId,
    )) as number;

    if (dto.approveStatus === 'approved') {
      this.operations.createDispatchesAndReminderForCase(
        approvedCaseId,
        userId,
        dto.dueDate,
      );
    }

    return this.dbServise.db.controlCases.readFullCase(
      approvedCaseId,
      userId,
    ) as Promise<CaseFull>;
  }
}
