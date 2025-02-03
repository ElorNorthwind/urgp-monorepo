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
  approveControlEntitySchema,
  ApproveControlEntityDto,
  deleteControlEntirySchema,
  DeleteControlEntityDto,
  defineControlAbilityFor,
  readFullCaseSchema,
  ReadFullCaseDto,
  readSlimCaseSchema,
  ReadSlimCaseDto,
  CaseSlim,
  createCaseSchema,
  CreateCaseDto,
  ApproveStatus,
  updateCaseSchema,
  UpdateCaseDto,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ControlClassificatorsService } from './control-classificators.service';
import { getCorrectApproveData } from './helper-functions/getCorrectApproveData';

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
    @Body(new ZodValidationPipe(createCaseSchema)) dto: CreateCaseDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('create', dto)) {
      throw new UnauthorizedException('Нет прав на создание');
    }
    const approveData = getCorrectApproveData({ user: req.user, dto });
    return this.controlCases.createCase(
      {
        ...dto,
        ...approveData,
      },
      req.user.id,
    );
  }

  @UsePipes(new ZodValidationPipe(readFullCaseSchema))
  @Get()
  async getFullCase(
    @Req() req: RequestWithUserData,
    @Query() { selector }: ReadFullCaseDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    if (selector === 'all' && i.cannot('read-all', 'Case'))
      throw new UnauthorizedException('Нет прав на чтение скрытых дел');
    return this.controlCases.readFullCase(selector, req.user.id);
  }

  @UsePipes(new ZodValidationPipe(readSlimCaseSchema))
  @Get('slim')
  async getSlimCase(@Query() { selector }: ReadSlimCaseDto) {
    return this.controlCases.readSlimCase(selector);
  }

  @Patch()
  async updateCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(updateCaseSchema)) dto: UpdateCaseDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const curCase = (await this.controlCases.readSlimCase(dto.id)) as CaseSlim;
    if (
      i.cannot('update', {
        ...curCase,
      })
    ) {
      throw new UnauthorizedException('Недостаточно прав для изменения');
    }

    const changesApproval =
      (dto?.approveDate && dto?.approveDate !== curCase.approveDate) ||
      (dto?.approveStatus && dto?.approveStatus !== curCase.approveStatus) ||
      (dto?.approveNotes && dto?.approveNotes !== curCase.approveNotes) ||
      (dto?.approveToId && dto?.approveToId !== curCase.approveToId) ||
      (dto?.approveFromId && dto?.approveFromId !== curCase.approveFromId);

    if (changesApproval && i.cannot('approve', curCase)) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нет прав на согласование.',
      );
    }

    const approveData = getCorrectApproveData({
      user: req.user,
      dto,
    });

    return this.controlCases.updateCase(
      { ...dto, ...(changesApproval ? approveData : {}) },
      req.user.id,
    );
  }

  @Delete()
  async deleteCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(deleteControlEntirySchema))
    dto: DeleteControlEntityDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentCase = (await this.controlCases.readSlimCase(
      dto.id,
    )) as CaseSlim;

    if (i.cannot('delete', currentCase)) {
      throw new UnauthorizedException('Недостаточно прав для удаления');
    }

    return this.controlCases.deleteCase(dto.id, req.user.id);
  }

  @Patch('approve')
  async approveCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(approveControlEntitySchema))
    dto: ApproveControlEntityDto,
  ) {
    const i = defineControlAbilityFor(req.user);

    const currentCase = (await this.controlCases.readSlimCase(
      dto.id,
    )) as CaseSlim;

    if (i.cannot('approve', currentCase)) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нет прав на согласование.',
      );
    }

    const approveData = getCorrectApproveData({
      user: req.user,
      dto,
    });

    return this.controlCases.approveCase(
      {
        ...dto,
        ...approveData,
      },
      req.user.id,
    );
  }
}
