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
import { getCorrectApproveData } from './helper-functions/getCorrectApproveData';

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

    const operationTypes = await this.classificators.getOperationTypesFlat();
    const autoApproved = !!operationTypes.find((operation) => {
      return operation.id === dto.typeId;
    })?.autoApprove;

    const approveData = autoApproved
      ? {
          approveStatus: 'approved' as ApproveStatus,
          approveFromId: req.user.id,
          approveToId: req.user.id,
          approveDate: new Date().toISOString(),
          approveNotes: 'Операция не требует согласования',
        }
      : getCorrectApproveData({
          user: req.user,
          dto,
        });

    if (!autoApproved && approveData.approveStatus === 'approved') {
      const affectedCase = (await this.controlCases.readFullCase(
        dto.caseId,
        req.user.id,
      )) as CaseFull;
      if (i.cannot('resolve', affectedCase)) {
        throw new UnauthorizedException(
          'Операция не разрешена. Решение по делу может принять только установившим высокий контроль.',
        );
      }
    }

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
    const currentOperation = (await this.controlOperations.readOperation(
      {
        operation: dto.id,
        class: 'all',
      },
      'slim',
    )) as OperationSlim;
    if (i.cannot('update', currentOperation)) {
      throw new UnauthorizedException('Нет прав на изменение');
    }

    const approveData = getCorrectApproveData({
      user: req.user,
      dto,
    });

    // TO DO Подумать на свежую голову
    if (approveData.approveStatus === 'approved') {
      const operationTypes = await this.classificators.getOperationTypesFlat();
      const autoApproved = !!operationTypes.find((operation) => {
        return operation.id === dto.typeId;
      })?.autoApprove;

      const affectedCase = (await this.controlCases.readFullCase(
        currentOperation.caseId,
        req.user.id,
      )) as CaseFull;

      if (i.cannot('resolve', affectedCase) && !autoApproved) {
        throw new UnauthorizedException(
          'Операция не разрешена. Решение по делу может принять только установившим высокий контроль.',
        );
      }
    }
    return this.controlOperations.updateOperation(dto, req.user.id);
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
    const i = defineControlAbilityFor(req.user);
    const currentOperation = (await this.controlOperations.readOperation(
      { operation: dto.id, class: 'all' },
      'slim',
    )) as OperationSlim;
    if (i.cannot('approve', currentOperation)) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нет прав на редактирование!',
      );
    }

    const approveData = getCorrectApproveData({
      user: req.user,
      dto,
    });

    const affectedCase = (await this.controlCases.readFullCase(
      currentOperation.caseId,
      req.user.id,
    )) as CaseFull;

    if (i.cannot('resolve', affectedCase)) {
      throw new UnauthorizedException(
        'Операция не разрешена. Решение по делу может принять только установившим высокий контроль.',
      );
    }

    return this.controlOperations.approveOperation(
      {
        ...dto,
        ...approveData,
      },
      req.user.id,
    );
  }
}
