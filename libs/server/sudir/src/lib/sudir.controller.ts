import { Controller, Get, Param } from '@nestjs/common';
import { SudirService } from './sudir.service';

@Controller('sudir')
export class SudirController {
  constructor(private readonly sudir: SudirService) {}

  @Get('pow/:input')
  async getPow(@Param('input') input: string) {
    return this.sudir.generateSudirPoW(input);
  }
}
