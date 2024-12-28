import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
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
    const correctApprover =
      dto?.approver ?? req.user?.controlData?.approvers?.cases?.[0] ?? null;

    const i = defineControlAbilityFor(req.user);
    const subject = {
      ...dto,
      approver: correctApprover,
      class: 'control-incident',
    };

    if (i.cannot('create', subject)) {
      throw new UnauthorizedException('Нет прав на создание');
    }
    if (i.cannot('set-approver', subject)) {
      throw new UnauthorizedException('Согласующий недоступен');
    }

    const approved = correctApprover === req.user.id;
    return this.controlCases.createCase(dto, req.user.id, approved);
  }

  @Get('all')
  async readCases() {
    return this.controlCases.readCases();
  }

  @Patch()
  async updateCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(caseUpdate)) dto: CaseUpdateDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentCase = await this.controlCases.readSlimCaseById(dto.id);

    if (i.cannot('update', { ...currentCase, class: 'control-incident' })) {
      throw new UnauthorizedException('Недостаточно прав для изменения');
    }
    if (
      i.cannot('set-approver', { ...currentCase, class: 'control-incident' })
    ) {
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
    const currentCase = await this.controlCases.readSlimCaseById(dto.id);

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
    const currentCase = await this.controlCases.readSlimCaseById(dto.id);

    if (i.cannot('approve', { ...currentCase, class: 'control-incident' })) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нет прав на согласование.',
      );
    }
    // TODO сделать асинхронный рефайн через зод вместо касла аще?
    const newApprover =
      dto.approveStatus === 'rejected'
        ? currentCase.authorId
        : dto?.nextApprover ||
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
