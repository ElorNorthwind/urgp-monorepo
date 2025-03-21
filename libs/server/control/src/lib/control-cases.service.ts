import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  ApproveControlEntityDto,
  ApproveStatus,
  CaseFull,
  CaseSlim,
  CreateCaseDto,
  GET_DEFAULT_CONTROL_DUE_DATE,
  OperationClasses,
  ReadEntityDto,
  SetConnectionsDto,
  SetConnectionsToDto,
  UpdateCaseDto,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';
import { ControlOperationsService } from './control-operations.service';
import { defineAbility } from '@casl/ability';
import { TelegramService } from '@urgp/server/telegram';

@Injectable()
export class ControlCasesService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly operations: ControlOperationsService,
    private readonly telegram: TelegramService,
    // private readonly classificators: ControlClassificatorsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async createCase(
    dto: CreateCaseDto,
    authorId: number,
  ): Promise<CaseFull> {
    const createdCaseId: number =
      await this.dbServise.db.controlCases.createCase(dto, authorId);

    // Напоминание автору
    await this.operations.createReminderForAuthorAndApproveTo(
      createdCaseId,
      authorId,
      dto?.dueDate,
    );

    // Напоминания и поручения исполнителям и подписавшимся
    if (dto.approveStatus === 'approved') {
      await this.operations.createDispatchesAndReminderForCase(
        createdCaseId,
        authorId,
        dto?.dueDate,
        dto?.manualControlToIds,
      );
    }

    const controlCase = await this.readFullCaseById(createdCaseId, authorId);

    // Уведомления о поступлении заявки на согласование
    if (
      controlCase?.approveStatus === ApproveStatus.pending &&
      controlCase?.approveTo?.id
    ) {
      this.telegram?.sendCaseProjectInfo(
        controlCase?.approveTo?.id,
        controlCase,
        'pending',
      );
    }

    return controlCase;
  }

  public async readCases(
    dto: ReadEntityDto,
    userId?: number,
  ): Promise<CaseSlim[] | CaseFull[]> {
    return this.dbServise.db.controlCases.readCases(dto, userId);
  }

  public async readSlimCaseById(caseId: number): Promise<CaseSlim> {
    const cases = (await this.readCases({
      mode: 'slim',
      case: [caseId],
    })) as CaseSlim[];
    if (cases.length === 0)
      throw new NotFoundException(`Дело ${caseId || '-'} не найдено`);
    return cases[0];
  }

  public async readFullCaseById(
    caseId: number,
    userId: number,
    allowHidden: boolean = false,
  ): Promise<CaseFull> {
    const cases = (await this.readCases(
      {
        mode: 'full',
        visibility: allowHidden ? 'all' : 'visible',
        case: [caseId],
      },
      userId,
    )) as CaseFull[];
    if (cases.length === 0)
      throw new NotFoundException(`Дело ${caseId || '-'} не найдено`);
    return cases[0];
  }

  public async readSlimCaseByOperationId(
    operationId: number,
  ): Promise<CaseSlim> {
    const cases = (await this.readCases({
      mode: 'slim',
      operation: [operationId],
    })) as CaseSlim[];
    if (cases.length === 0)
      throw new NotFoundException(
        `Дело с операцией ${operationId || '-'} не найдено`,
      );
    return cases[0];
  }

  public async readFullCaseByOperationId(
    operationId: number,
    userId: number,
  ): Promise<CaseFull> {
    const cases = (await this.readCases({
      mode: 'full',
      operation: [operationId],
    })) as CaseFull[];
    if (cases.length === 0)
      throw new NotFoundException(
        `Дело с операцией ${operationId || '-'} не найдено`,
      );
    return cases[0];
  }

  public async updateCase(
    dto: UpdateCaseDto,
    updatedById: number,
  ): Promise<CaseFull> {
    const updatedCaseId = await this.dbServise.db.controlCases.updateCase(
      dto,
      updatedById,
    );

    const updatedCase = await this.readSlimCaseById(updatedCaseId);
    if (updatedCase.approveStatus === 'approved') {
      await this.operations.createDispatchesAndReminderForCase(
        updatedCaseId,
        updatedById,
        GET_DEFAULT_CONTROL_DUE_DATE(),
        dto.manualControlToIds,
      );
    }

    return this.readFullCaseById(
      updatedCaseId,
      updatedById,
    ) as Promise<CaseFull>;
  }

  public async deleteCase(id: number, userId: number): Promise<number> {
    return this.dbServise.db.controlCases.deleteCase(id, userId);
  }

  public async approveCase(
    dto: ApproveControlEntityDto, // patched with correct approve data in controller
    userId: number,
  ): Promise<CaseFull> {
    const approvedCaseId = (await this.dbServise.db.controlCases.approveCase(
      dto,
      userId,
    )) as number;

    if (dto.approveStatus === 'approved') {
      await this.operations.createDispatchesAndReminderForCase(
        approvedCaseId,
        userId,
        dto.dueDate,
      );
    } else {
      await this.operations.createReminderForAuthorAndApproveTo(
        approvedCaseId,
        userId,
        dto?.dueDate,
      );
    }

    const controlCase = await this.readFullCaseById(approvedCaseId, userId);

    // Уведомления о поступлении заявки на согласование
    if (
      controlCase?.approveStatus === ApproveStatus.pending &&
      controlCase?.approveTo?.id
    ) {
      this.telegram?.sendCaseProjectInfo(
        controlCase?.approveTo?.id,
        controlCase,
        'pending',
      );
    }

    // Уведомления об отказе в согласовании заявки
    if (
      controlCase?.approveStatus === ApproveStatus.rejected &&
      controlCase?.approveFrom?.id
    ) {
      this.telegram?.sendCaseProjectInfo(
        controlCase?.approveFrom?.id,
        controlCase,
        'reject',
      );
    }

    return controlCase;
  }

  public async setCaseConnections(
    dto: SetConnectionsDto,
    userId: number,
  ): Promise<number[]> {
    return this.dbServise.db.controlCases.upsertCaseConnections(dto, userId);
  }

  public async setCaseConnectionsTo(
    dto: SetConnectionsToDto,
    userId: number,
  ): Promise<number[]> {
    return this.dbServise.db.controlCases.upsertCaseConnectionsTo(dto, userId);
  }
}
