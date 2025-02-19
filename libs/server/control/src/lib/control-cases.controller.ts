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
  CaseClasses,
  CaseFull,
  CaseSlim,
  CreateCaseDto,
  DeleteControlEntityDto,
  ReadEntityDto,
  RequestWithUserData,
  SetConnectionsDto,
  SetConnectionsToDto,
  UpdateCaseDto,
  approveControlEntitySchema,
  createCaseSchema,
  defineControlAbilityFor,
  deleteControlEntirySchema,
  readEntitySchema,
  setConnectionsSchema,
  setConnectionsToSchema,
  updateCaseSchema,
} from '@urgp/shared/entities';
import { ControlCasesService } from './control-cases.service';
import { ControlClassificatorsService } from './control-classificators.service';
import { differenceInDays } from 'date-fns';
import { userInfo } from 'os';

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

    const createdCase = await this.controlCases.createCase(
      {
        ...dto,
        ...approveData,
      },
      req.user.id,
    );

    if (createdCase.class === CaseClasses.incident) {
      this.controlCases.setCaseConnections(
        { fromId: createdCase.id, toIds: dto.connectionsToIds },
        req.user.id,
      );
    } else if (createdCase.class === CaseClasses.problem) {
      this.controlCases.setCaseConnectionsTo(
        { toId: createdCase.id, fromIds: dto.connectionsFromIds },
        req.user.id,
      );
    }

    return createdCase;
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
    const curCase = (await this.controlCases.readFullCaseById(
      dto.id,
      req.user.id,
    )) as CaseFull;
    if (
      i.cannot('update', {
        ...curCase,
      })
    ) {
      throw new UnauthorizedException('Недостаточно прав для изменения');
    }

    if (dto.class === CaseClasses.incident) {
      this.controlCases.setCaseConnections(
        { fromId: dto.id, toIds: dto.connectionsToIds },
        req.user.id,
      );
    } else if (dto.class === CaseClasses.problem) {
      this.controlCases.setCaseConnectionsTo(
        { toId: dto.id, fromIds: dto.connectionsFromIds },
        req.user.id,
      );
    }

    return this.controlCases.updateCase(dto, req.user.id);
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

  @Patch('connections')
  async setCaseConnections(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(setConnectionsSchema))
    dto: SetConnectionsDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const caseFrom = await this.controlCases.readSlimCaseById(dto.fromId);
    if (i.cannot('update', caseFrom))
      throw new UnauthorizedException('Недостаточно прав для изменения');

    return this.controlCases.setCaseConnections(dto, req.user.id);
  }

  @Patch('connections-to')
  async setCaseConnectionsTo(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(setConnectionsToSchema))
    dto: SetConnectionsToDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const caseTo = await this.controlCases.readSlimCaseById(dto.toId);
    if (i.cannot('update', caseTo))
      throw new UnauthorizedException('Недостаточно прав для изменения');

    return this.controlCases.setCaseConnectionsTo(dto, req.user.id);
  }
}
