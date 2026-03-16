import { Controller, Get } from '@nestjs/common';
import { TeletribeService } from './teletribe.service';

@Controller('teletribe')
export class TeletribeController {
  constructor(private readonly teletribe: TeletribeService) {}

  @Get('report')
  Connect(): Promise<any> {
    return this.teletribe.insertLongTermHotlineReport({
      dateFrom: '16.03.2026',
      dateTo: '17.03.2026',
    });
  }
}
