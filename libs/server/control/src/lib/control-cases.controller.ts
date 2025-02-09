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
import { AccessTokenGuard } from '@urgp/server/auth';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  ApproveControlEntityDto,
  CaseFull,
  CaseSlim,
  CreateCaseDto,
  DeleteControlEntityDto,
  ReadEntityDto,
  RequestWithUserData,
  UpdateCaseDto,
  approveControlEntitySchema,
  createCaseSchema,
  defineControlAbilityFor,
  deleteControlEntirySchema,
  readEntitySchema,
  updateCaseSchema,
} from '@urgp/shared/entities';
import { ControlCasesService } from './control-cases.service';
import { ControlClassificatorsService } from './control-classificators.service';

@Controller('control/case')
@UseGuards(AccessTokenGuard)
export class ControlCasesController {
  constructor(
    private readonly controlCases: ControlCasesService,
    private readonly classificators: ControlClassificatorsService,
  ) {}

  @Post()
  async createCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(createCaseSchema)) dto: CreateCaseDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('create', dto))
      throw new UnauthorizedException('Нет прав на создание');
    const approveData = await this.classificators.getCorrectApproveData({
      user: req.user,
      dto,
      isOperation: false,
    });
    return this.controlCases.createCase(
      {
        ...dto,
        ...approveData,
      },
      req.user.id,
    );
  }

  @Get(':id/slim')
  getSlimCaseById(@Param('id', ParseIntPipe) id: number): Promise<CaseSlim> {
    return this.controlCases.readSlimCaseById(id);
  }

  @Get(':id/full')
  getFullCaseById(
    @Req() req: RequestWithUserData,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CaseFull> {
    return this.controlCases.readFullCaseById(id, req.user.id);
  }

  @Get(':id/by-operation')
  getFullCaseByOperationId(
    @Req() req: RequestWithUserData,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CaseFull> {
    return this.controlCases.readFullCaseByOperationId(id, req.user.id);
  }

  @UsePipes(new ZodValidationPipe(readEntitySchema))
  @Get()
  async getFullCase(
    @Req() req: RequestWithUserData,
    @Query() dto: ReadEntityDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    if (dto?.visibility === 'all' && i.cannot('read-all', 'Case'))
      throw new UnauthorizedException('Нет прав на чтение скрытых дел');
    return this.controlCases.readCases(dto, req.user.id);
  }

  @Patch()
  async updateCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(updateCaseSchema)) dto: UpdateCaseDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const curCase = (await this.controlCases.readSlimCaseById(
      dto.id,
    )) as CaseSlim;
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
      (dto?.approveToId && dto?.approveToId !== curCase.approveToId);
    // || (dto?.approveFromId && dto?.approveFromId !== curCase.approveFromId);

    const approveData = await this.classificators.getCorrectApproveData({
      user: req.user,
      dto,
      isOperation: false,
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
    const currentCase = (await this.controlCases.readSlimCaseById(
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
    const approveData = await this.classificators.getCorrectApproveData({
      user: req.user,
      dto,
      isOperation: false,
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
