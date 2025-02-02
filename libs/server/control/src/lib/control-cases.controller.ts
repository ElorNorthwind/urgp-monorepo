import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ControlCaseService } from './control-cases.service';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  RequestWithUserData,
  CaseCreateDto,
  caseCreate,
  caseUpdate,
  CaseUpdateDto,
  userInputApprove,
  UserInputApproveDto,
  userInputDelete,
  UserInputDeleteDto,
  defineControlAbilityFor,
  Case,
  CaseWithPendingInfo,
  readFullCase,
  ReadFullCaseDto,
  readSlimCase,
  ReadSlimCaseDto,
  CaseSlim,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ControlClassificatorsService } from './control-classificators.service';

@Controller('control/case')
@UseGuards(AccessTokenGuard)
export class ControlCasesController {
  constructor(
    private readonly controlCases: ControlCaseService,
    private readonly classificators: ControlClassificatorsService,
  ) {}

  @Post()
  async createCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(caseCreate)) dto: CaseCreateDto,
  ) {
    const correctApproverId =
      dto?.approverId ?? req.user?.controlData?.approvers?.cases?.[0] ?? null;

    const i = defineControlAbilityFor(req.user);
    const subject = {
      ...dto,
      approver: correctApproverId,
      class: 'control-incident',
    };

    if (i.cannot('create', subject)) {
      throw new UnauthorizedException('Нет прав на создание');
    }
    if (i.cannot('set-approver', subject)) {
      Logger.warn(
        'Согласующий недоступен',
        JSON.stringify({
          dtoApprover: dto?.approverId,
          userFio: req.user.fio,
          userApprovers: req.user.controlData?.approvers?.cases,
        }),
      );
      throw new UnauthorizedException('Согласующий недоступен');
    }

    const approved = correctApproverId === req.user.id;
    return this.controlCases.createCase(
      { ...dto, approverId: correctApproverId },
      req.user.id,
      approved,
    );
  }

  @UsePipes(new ZodValidationPipe(readFullCase))
  @Get('full')
  async getFullCase(
    @Req() req: RequestWithUserData,
    @Query() { selector }: ReadFullCaseDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    if (selector === 'all' && i.cannot('read-all', 'Case'))
      throw new UnauthorizedException('Нет прав на чтение скрытых дел');
    return this.controlCases.readFullCase(selector, req.user.id);
  }

  @UsePipes(new ZodValidationPipe(readSlimCase))
  @Get('slim')
  async getSlimCase(@Query() { selector }: ReadSlimCaseDto) {
    return this.controlCases.readSlimCase(selector);
  }

  @Patch()
  async updateCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(caseUpdate)) dto: CaseUpdateDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentCase = await this.controlCases.readSlimCase(dto.id);
    if (
      i.cannot('update', {
        ...(currentCase as CaseSlim),
        class: 'control-incident',
      })
    ) {
      throw new UnauthorizedException('Недостаточно прав для изменения');
    }
    if (
      i.cannot('set-approver', {
        ...(currentCase as CaseSlim),
        class: 'control-incident',
      }) ||
      i.cannot('set-approver', { ...dto, class: 'control-incident' })
    ) {
      Logger.warn(
        'Согласующий недоступен',
        JSON.stringify({
          currentApprover: (currentCase as CaseSlim).payload.approverId,
          dtoApprover: dto?.approverId,
          userFio: req.user.fio,
          userApprovers: req.user.controlData?.approvers?.cases,
        }),
      );
      throw new UnauthorizedException('Согласующий недоступен');
    }

    return this.controlCases.updateCase(dto, req.user.id);
  }

  @Delete()
  async deleteCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(userInputDelete)) dto: UserInputDeleteDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentCase = (await this.controlCases.readSlimCase(
      dto.id,
    )) as CaseSlim;

    if (i.cannot('delete', { ...currentCase, class: 'control-incident' })) {
      throw new UnauthorizedException('Недостаточно прав для удаления');
    }
    return this.controlCases.deleteCase(dto.id, req.user.id);
  }

  @Patch('approve')
  async approveCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(userInputApprove)) dto: UserInputApproveDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentCase = (await this.controlCases.readSlimCase(
      dto.id,
    )) as CaseSlim;

    if (i.cannot('approve', { ...currentCase, class: 'control-incident' })) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нет прав на согласование.',
      );
    }

    if (
      i.cannot('set-approver', {
        ...dto,
        approverId: dto.nextApproverId,
        class: 'control-incident',
      })
    ) {
      Logger.warn(
        'Согласующий недоступен',
        JSON.stringify({
          currentApprover: currentCase.payload.approverId,
          dtoApprover: dto?.nextApproverId,
          userFio: req.user.fio,
          userApprovers: req.user.controlData?.approvers?.cases,
        }),
      );
      throw new UnauthorizedException('Согласующий недоступен');
    }

    const newApprover =
      dto.approveStatus === 'rejected'
        ? currentCase.authorId
        : dto?.nextApproverId ||
          req.user?.controlData?.approvers?.cases?.[0] ||
          null;

    return this.controlCases.approveCase(
      {
        ...dto,
        approveStatus:
          dto.approveStatus === 'rejected'
            ? 'rejected'
            : newApprover === req.user.id
              ? dto.approveStatus
              : 'pending',
      },
      req.user.id,
      newApprover,
    );
  }
}
