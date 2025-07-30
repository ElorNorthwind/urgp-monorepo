import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { VksService } from './vks.service';

@Controller('vks')
@UseGuards(AccessTokenGuard)
export class VksController {
  constructor(private readonly vks: VksService) {}

  @Get('qms')
  getTest(): Promise<string> {
    return this.vks.GetQmsReport();
  }

  @Get('anketolog/user')
  getAnketologUserSurvey(): Promise<string> {
    return this.vks.GetAnketologUserReport();
  }

  @Get('anketolog/client')
  getAnketologClientSurvey(): Promise<string> {
    return this.vks.GetAnketologClientReport();
  }
}
