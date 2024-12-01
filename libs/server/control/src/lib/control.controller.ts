import {
  Body,
  Controller,
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
    const id = req.user.id;
    if (id !== dto.authorId) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нельзя создавать заявки от имени другого пользователя!',
      );
    }
    const controlData = await this.control.getControlData(id);
    if (!controlData?.approvers?.cases?.includes(dto.approver)) {
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    return this.control.createCase(dto, id);
  }
}
