import { Controller, Get } from '@nestjs/common';
import { DmService } from './dm.service';

@Controller('dm')
export class DmController {
  constructor(private readonly dm: DmService) {}

  @Get('test')
  Test(): Promise<any> {
    return this.dm.test();
  }
}
