import { Controller, Get } from '@nestjs/common';
import { TeletribeService } from './teletribe.service';

@Controller('teletribe')
export class TeletribeController {
  constructor(private readonly teletribe: TeletribeService) {}

  @Get('report')
  Connect(): Promise<any> {
    return this.teletribe.getHotlineReport({
      reportType: 'hotline_score',
    });
  }
}
