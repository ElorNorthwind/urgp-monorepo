import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { QmsService } from './qms.service';

@Controller('qms')
@UseGuards(AccessTokenGuard)
export class QmsController {
  constructor(private readonly qms: QmsService) {}

  @Get('test')
  getTest(): Promise<string> {
    return this.qms.test();
  }
}
