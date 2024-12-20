import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  RequestWithUserData,
  userInputApprove,
  UserInputApproveDto,
  controlStageCreate,
  ControlStageCreateDto,
  ControlOperation,
  controlStageUpdate,
  ControlStageUpdateDto,
  userInputDelete,
  UserInputDeleteDto,
  ControlOperationSlim,
  ControlOperationPayloadHistoryData,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ControlOperationsService } from './control-operations.service';
import { ControlClassificatorsService } from './control-classificators.service';

@Controller('control/operation')
@UseGuards(AccessTokenGuard)
export class ControlOperationsController {
  constructor(
    private readonly controlOperations: ControlOperationsService,
    private readonly classificators: ControlClassificatorsService,
  ) {}

  @Post('stage')
  async createStage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(controlStageCreate)) dto: ControlStageCreateDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const userId = req.user.id;
    const controlData = await this.classificators.getControlData(userId);
    const operationTypes = await this.classificators.getOperationTypesFlat();

    const autoApproved = !!operationTypes.find((operation) => {
      return operation.id === dto.type;
    })?.autoApprove;

    const correctApprover =
      dto?.approver ??
      controlData?.approvers?.operations?.[0] ??
      (autoApproved ? userId : null);

    if (
      !autoApproved &&
      correctApprover &&
      !controlData?.approvers?.operations?.includes(correctApprover)
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    const approved = autoApproved || correctApprover === userId;

    return this.controlOperations.createStage(
      {
        ...dto,
        approver: correctApprover,
      },
      userId,
      approved,
    );
  }

  @Get(':id')
  getOperationById(@Param('id') id: number): Promise<ControlOperation> {
    return this.controlOperations.readFullOperationById(id);
  }

  @Get(':id/history')
  getOperationPayloadHistory(
    @Param('id') id: number,
  ): Promise<ControlOperationPayloadHistoryData[]> {
    return this.controlOperations.readOperationPayloadHistory(id);
  }

  @Get('stage/by-case/:id')
  getStagesByCaseId(
    @Req() req: RequestWithUserData,
    @Param('id') id: number,
  ): Promise<ControlOperation[]> {
    return this.controlOperations.readOperationsByCaseId(
      id,
      req.user.id,
      'stage',
    );
  }

  @Patch('stage')
  async updateStage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(controlStageUpdate)) dto: ControlStageUpdateDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const currentOperation = await this.controlOperations.readSlimOperationById(
      dto.id,
    );

    const userId = req.user.id;
    if (
      userId !== currentOperation.authorId &&
      (currentOperation.class !== 'stage' ||
        userId !== currentOperation.payload?.approver)
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Менять этап работы может только автор или текущий согласующий!',
      );
    }

    const controlData = await this.classificators.getControlData(userId);
    if (
      !!controlData.roles.includes('admin') &&
      currentOperation.payload?.approveStatus === 'approved' &&
      userId !== currentOperation.payload?.approveBy
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Менять согласованный этап может только тот, кто его согласовал (или админ)!',
      );
    }

    if (
      dto.approver &&
      !controlData?.approvers?.cases?.includes(dto.approver)
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    return this.controlOperations.updateStage(dto, userId);
  }

  @Delete()
  async deleteOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(userInputDelete)) dto: UserInputDeleteDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const userId = req.user.id;
    const currentOperation = await this.controlOperations.readSlimOperationById(
      dto.id,
    );
    if (!currentOperation) {
      throw new BadRequestException('Операция не найдена!');
    }

    const controlData = await this.classificators.getControlData(userId);

    if (currentOperation.payload.isDeleted) {
      throw new BadRequestException('Операция уже удалена!');
    }

    if (
      userId !== currentOperation.authorId &&
      !controlData.roles.includes('admin')
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Удалить операцию может только ее автор или администратор!',
      );
    }

    return this.controlOperations.deleteOperation(dto.id, userId);
  }

  @Patch('approve')
  async approveOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(userInputApprove)) dto: UserInputApproveDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const userId = req.user.id;
    const currentOperation = await this.controlOperations.readSlimOperationById(
      dto.id,
    );
    const controlData = await this.classificators.getControlData(userId);

    if (
      !controlData.roles.includes('admin') &&
      (currentOperation.class !== 'stage' ||
        userId !== currentOperation.payload?.approver)
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Пользователь не является согласующим!',
      );
    }

    if (
      !controlData.roles.includes('admin') &&
      dto?.nextApprover &&
      !!controlData?.approvers?.cases?.includes(dto.nextApprover)
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    if (currentOperation.payload.isDeleted) {
      throw new BadRequestException(
        'Заявка уже удалена, согласование непозвожно!',
      );
    }

    const newApprover =
      dto.approveStatus === 'rejected'
        ? currentOperation.authorId
        : dto?.nextApprover || controlData?.approvers?.cases?.[0] || null;

    return this.controlOperations.approveOperation(
      {
        ...dto,
        approveStatus:
          dto.approveStatus === 'rejected'
            ? 'rejected'
            : newApprover === userId
              ? dto.approveStatus
              : 'pending',
      },
      userId,
      newApprover,
    );
  }
}
