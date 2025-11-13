import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { LettersService } from './letters.service';

@Controller('letters')
export class LettersController {
  constructor(private readonly letters: LettersService) {}

  @Get('notify-unchanged-resolutions')
  async notifyUnchangedResolutions() {
    return this.letters.notifyUnchangedResolutionsManual();
  }

  @Get('notify-new-urgent')
  async notifyNewUrgentLetters() {
    return this.letters.notifyNewUrgentLettersManual();
  }

  @Get('notify-undone-urgent')
  async notifyUndoneUrgentLetters() {
    return this.letters.notifyUndoneUrgentLettersManual();
  }
}
