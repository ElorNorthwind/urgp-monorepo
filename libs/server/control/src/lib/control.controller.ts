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
import { ControlService } from './control.service';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  RequestWithUserData,
  CaseCreateDto,
  caseCreate,
  caseUpdate,
  CaseUpdateDto,
  caseDelete,
  CaseDeleteDto,
  userInputApprove,
  UserInputApproveDto,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';

@Controller('control')
@UseGuards(AccessTokenGuard)
export class ControlController {
  constructor(private readonly control: ControlService) {}

  @Post('case')
  async createCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(caseCreate)) dto: CaseCreateDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const userId = req.user.id;
    if (userId !== dto.authorId) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нельзя создавать заявки от имени другого пользователя!',
      );
    }
    const controlData = await this.control.getControlData(userId);
    if (!controlData?.approvers?.cases?.includes(dto.approver)) {
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    return this.control.createCase(dto, userId);
  }

  @Get('cases')
  async readCases() {
    return this.control.readCases();
  }

  @Patch('case')
  async updateCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(caseUpdate)) dto: CaseUpdateDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const currentCase = await this.control.readCaseById(dto.id);
    const userId = req.user.id;
    if (
      userId !== currentCase.authorId &&
      userId !== currentCase.payload.approver
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Менять заявку может только автор или текущий согласующий!',
      );
    }
    const controlData = await this.control.getControlData(userId);
    if (
      dto.approver &&
      !controlData?.approvers?.cases?.includes(dto.approver)
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    return this.control.updateCase(dto, userId);
  }

  @Delete('case')
  async deleteCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(caseDelete)) dto: CaseDeleteDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const userId = req.user.id;
    const currentCase = await this.control.readCaseById(dto.id);
    const controlData = await this.control.getControlData(userId);

    if (currentCase.payload.isDeleted) {
      throw new BadRequestException('Заявка уже удалена!');
    }

    if (
      userId !== currentCase.authorId &&
      !controlData.roles.includes('admin')
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Удалять заявку может только ее автор или администратор!',
      );
    }

    return this.control.deleteCase(dto.id, userId);
  }

  @Patch('case/approve')
  async approveCase(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(userInputApprove)) dto: UserInputApproveDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL, ленивый ты уебок!
    const userId = req.user.id;
    const currentCase = await this.control.readCaseById(dto.id);
    const controlData = await this.control.getControlData(userId);

    if (
      !controlData.roles.includes('admin') &&
      userId !== currentCase.payload.approver
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

    if (currentCase.payload.isDeleted) {
      throw new BadRequestException(
        'Заявка уже удалена, согласование непозвожно!',
      );
    }

    const newApprover =
      dto.approveStatus === 'rejected'
        ? currentCase.authorId
        : dto?.nextApprover || controlData?.approvers?.cases?.[0] || null;

    return this.control.approveCase(
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
