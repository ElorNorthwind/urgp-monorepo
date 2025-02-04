import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  RequestWithUserData,
  approveControlEntitySchema,
  ApproveControlEntityDto,
  deleteControlEntirySchema,
  DeleteControlEntityDto,
  defineControlAbilityFor,
  CaseFull,
  OperationFull,
  OperationSlim,
  readOperationSchema,
  ReadOperationDto,
  createOperationSchema,
  CreateOperationDto,
  ApproveStatus,
  updateOperationSchema,
  UpdateOperationDto,
  markOperationSchema,
  MarkOperationDto,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ControlOperationsService } from './control-operations.service';
import { ControlClassificatorsService } from './control-classificators.service';
import { ControlCaseService } from './control-cases.service';

@Controller('control/operation')
@UseGuards(AccessTokenGuard)
export class ControlOperationsController {
  constructor(
    private readonly controlOperations: ControlOperationsService,
    private readonly controlCases: ControlCaseService,
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

    const approveData = this.classificators.getCorrectApproveData({
      user: req.user,
      dto,
      isOperation: true,
    });

    return this.controlOperations.createOperation(
      {
        ...dto,
        ...approveData,
      },
      req.user.id,
    );
  }

  @UsePipes(new ZodValidationPipe(readOperationSchema))
  @Get()
  async getFullOperation(@Query() dto: ReadOperationDto) {
    return this.controlOperations.readOperation(dto, 'full');
  }

  @UsePipes(new ZodValidationPipe(readOperationSchema))
  @Get('slim')
  async getSlimOperation(@Query() dto: ReadOperationDto) {
    return this.controlOperations.readOperation(dto, 'slim');
  }

  @Get(':id/history')
  getOperationPayloadHistory(
    @Param('id') id: number,
  ): Promise<Array<OperationFull & { revisionId: number }>> {
    return this.controlOperations.readOperationHistory(id);
  }

  @Patch()
  async updateOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(updateOperationSchema)) dto: UpdateOperationDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const curentOp = (await this.controlOperations.readOperation(
      {
        operation: dto.id,
        class: 'all',
      },
      'slim',
    )) as OperationSlim;
    if (i.cannot('update', curentOp)) {
      throw new UnauthorizedException('Нет прав на изменение');
    }

    const changesApproval =
      (dto?.approveDate && dto?.approveDate !== curentOp.approveDate) ||
      (dto?.approveStatus && dto?.approveStatus !== curentOp.approveStatus) ||
      (dto?.approveNotes && dto?.approveNotes !== curentOp.approveNotes) ||
      (dto?.approveToId && dto?.approveToId !== curentOp.approveToId) ||
      (dto?.approveFromId && dto?.approveFromId !== curentOp.approveFromId);

    const approveData = this.classificators.getCorrectApproveData({
      user: req.user,
      dto,
      isOperation: true,
    });

    return this.controlOperations.updateOperation(
      { ...dto, ...approveData },
      req.user.id,
    );
  }

  @Patch('mark-operation')
  async markOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(markOperationSchema)) dto: MarkOperationDto,
  ) {
    return this.controlOperations.markOperation(dto, req.user.id);
  }

  @Delete()
  async deleteOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(deleteControlEntirySchema))
    dto: DeleteControlEntityDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentOperation = (await this.controlOperations.readOperation(
      { operation: dto.id, class: 'all' },
      'slim',
    )) as OperationSlim;

    if (i.cannot('delete', currentOperation)) {
      throw new BadRequestException('Нет прав на удаление!');
    }

    return this.controlOperations.deleteOperation(dto.id, req.user.id);
  }

  @Patch('approve')
  async approveOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(approveControlEntitySchema))
    dto: ApproveControlEntityDto,
  ) {
    const approveData = this.classificators.getCorrectApproveData({
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
