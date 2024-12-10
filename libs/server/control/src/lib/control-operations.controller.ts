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
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ControlOperationsService } from './control-operations.service';

@Controller('control/operation')
@UseGuards(AccessTokenGuard)
export class ControlOperationsController {
  constructor(private readonly controlOperations: ControlOperationsService) {}

  @Post('stage')
  async createStage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(controlStageCreate)) dto: ControlStageCreateDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const userId = req.user.id;
    if (userId !== dto.authorId) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нельзя создавать операции от имени другого пользователя!',
      );
    }
    const controlData = await this.controlOperations.getControlData(userId);
    if (!controlData?.approvers?.operations?.includes(dto.approver)) {
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    const operationTypes = await this.controlOperations.getOperationTypes();
    const approved = !!operationTypes.find((operation) => {
      operation.id === dto.type;
    })?.autoApprove;

    return this.controlOperations.createStage(dto, userId, approved);
  }

  @Get('stage/case/:id')
  getStagesByCaseId(@Param('id') id: number): Promise<ControlOperation[]> {
    return this.controlOperations.readOperationsByCaseId(id, 'stage');
  }

  @Patch('stage')
  async updateStage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(controlStageUpdate)) dto: ControlStageUpdateDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const currentOperation = await this.controlOperations.readOperationById(
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
    const controlData = await this.controlOperations.getControlData(userId);
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
    const currentOperation = await this.controlOperations.readOperationById(
      dto.id,
    );
    const controlData = await this.controlOperations.getControlData(userId);

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
    const currentOperation = await this.controlOperations.readOperationById(
      dto.id,
    );
    const controlData = await this.controlOperations.getControlData(userId);

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
