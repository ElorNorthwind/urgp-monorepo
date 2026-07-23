import { Controller, Get } from '@nestjs/common';
import { TeletribeService } from './teletribe.service';

@Controller('teletribe')
export class TeletribeController {
  constructor(private readonly teletribe: TeletribeService) {}

  @Get('report')
  Connect(): Promise<any> {
    // return this.teletribe.insertLongTermHotlineReport({
    //   dateFrom: '15.01.2025',
    //   dateTo: '01.02.2025',
    // });

    // return this.teletribe.insertHotlineReport({
    //   dateFrom: '12.07.2026',
    //   dateTo: '24.07.2026',
    // });

    return this.teletribe.insertHotlineReport();
  }
}
