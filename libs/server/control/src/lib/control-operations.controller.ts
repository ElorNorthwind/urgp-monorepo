import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
  CreateOperationDto,
  DeleteControlEntityDto,
  MarkAsWatchedDto,
  MarkOperationDto,
  OperationClasses,
  OperationFull,
  OperationSlim,
  ReadEntityDto,
  RequestWithUserData,
  UpdateOperationDto,
  approveControlEntitySchema,
  createOperationSchema,
  defineControlAbilityFor,
  deleteControlEntirySchema,
  markAsWatchedSchema,
  markOperationSchema,
  readEntitySchema,
  updateOperationSchema,
} from '@urgp/shared/entities';
import { ControlClassificatorsService } from './control-classificators.service';
import { ControlOperationsService } from './control-operations.service';

@Controller('control/operation')
@UseGuards(AccessTokenGuard)
export class ControlOperationsController {
  constructor(
    private readonly controlOperations: ControlOperationsService,
    // private readonly controlCases: ControlCasesService,
    private readonly classificators: ControlClassificatorsService,
  ) {}

  @Post()
  async createOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(createOperationSchema)) dto: CreateOperationDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('create', dto)) {
      throw new UnauthorizedException('Нет прав на создание');
    }

    const approveData = await this.classificators.getCorrectApproveData({
      user: req.user,
      dto,
      isOperation: true,
    });

    const operation = await this.controlOperations.createOperation(
      {
        ...dto,
        ...approveData,
      },
      req.user.id,
    );

    if (operation.class === OperationClasses.dispatch) {
      this.controlOperations.createRemindeByControlTo(operation, req.user.id);
    }

    return operation;
  }

  @UsePipes(new ZodValidationPipe(readEntitySchema))
  @Get()
  async getOperations(
    @Req() req: RequestWithUserData,
    @Query() dto: ReadEntityDto,
  ) {
    return this.controlOperations.readOperations(dto, req.user.id);
  }

  @Get(':id/slim')
  getSlimOperationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OperationSlim> {
    return this.controlOperations.readSlimOperationById(id);
  }

  @Get(':id/full')
  getFullOperationById(
    @Req() req: RequestWithUserData,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OperationFull> {
    return this.controlOperations.readFullOperationById(id, req.user.id);
  }

  @Get(':id/history')
  getOperationHistory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Array<OperationFull & { revisionId: number }>> {
    return this.controlOperations.readOperationHistory(id);
  }

  @Patch()
  async updateOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(updateOperationSchema)) dto: UpdateOperationDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const curentOp = (await this.controlOperations.readSlimOperationById(
      dto.id,
    )) as OperationSlim;
    if (i.cannot('update', curentOp)) {
      throw new UnauthorizedException('Нет прав на изменение');
    }

    const operation = await this.controlOperations.updateOperation(
      dto,
      req.user.id,
    );

    if (operation.class === OperationClasses.dispatch) {
      this.controlOperations.createRemindeByControlTo(operation, req.user.id);
    }

    return operation;
  }

  @Patch('mark-operation')
  async markOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(markOperationSchema)) dto: MarkOperationDto,
  ) {
    return this.controlOperations.markOperation(dto, req.user.id);
  }

  @Patch('mark-as-watched')
  async markAsWatched(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(markAsWatchedSchema))
    { caseIds }: MarkAsWatchedDto,
  ) {
    if (!caseIds || caseIds?.length === 0)
      throw new BadRequestException('Нужен корректный список дел');

    return this.controlOperations.markAsWatched(caseIds, req.user.id);
  }

  @Delete()
  async deleteOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(deleteControlEntirySchema))
    dto: DeleteControlEntityDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentOperation = await this.controlOperations.readSlimOperationById(
      dto.id,
    );

    if (i.cannot('delete', currentOperation)) {
      throw new UnauthorizedException('Нет прав на удаление!');
    }

    return this.controlOperations.deleteOperation(dto.id, req.user.id);
  }

  @Patch('approve')
  async approveOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(approveControlEntitySchema))
    dto: ApproveControlEntityDto,
  ) {
    const approveData = await this.classificators.getCorrectApproveData({
      user: req.user,
      dto,
      isOperation: true,
    });
    return this.controlOperations.approveOperation(
      {
        ...dto,
        ...approveData,
      },
      req.user.id,
    );
  }
}
