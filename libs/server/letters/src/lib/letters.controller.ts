import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { LettersService } from './letters.service';

@Controller('letters')
export class LettersController {
  constructor(private readonly letters: LettersService) {}

  @Get('notify-unchanged-resolutions')
  async notifyUnchangedResolutions() {
    return this.letters.notifyUnchangedResolutionsManual();
  }
}
