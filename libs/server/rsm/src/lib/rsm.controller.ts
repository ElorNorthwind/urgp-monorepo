import { Controller, Get } from '@nestjs/common';
import { RsmBtriService } from './bti.service';
import { HouseSerachQuery } from '../model/types';

@Controller('rsm/bti')
export class RsmController {
  constructor(private readonly bti: RsmBtriService) {}

  @Get('house')
  getHouseInfoTest(): unknown {
    const testQuery: HouseSerachQuery = {
      street:
        '[1291923,608949,1259696,871768,1100445,1550469,682022,776660,512109,567263,594899,605367,230403,470942,470944,1023030,1023172,1023183,1022931,197956,198746,199060,198909,198928,198956,198976,198995,199041,198547,198581,198598,198608,198620,198650,198684,198448,198458,226532,197669,198396,197479,197480,197481,197484,200576,229156]',
      housingNum: '9',
    };
    return this.bti.searchHouses(testQuery);
  }
}
