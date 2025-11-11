import { Controller, Get, UseGuards } from '@nestjs/common';
import { DataMosService } from './data-mos.service';
import { AccessTokenGuard } from '@urgp/server/auth';

@Controller('data-mos')
@UseGuards(AccessTokenGuard)
export class DataMosController {
  constructor(private readonly dataMos: DataMosService) {}
  @Get('update-address')
  updateAdresses(): Promise<number> {
    return this.dataMos.updateAdresses(471000).then((res) => res.count);
  }

  @Get('update-transport-stations')
  async updateTransportStations(): Promise<number> {
    let total = 0;
    for (const type of ['rail', 'mcd', 'metro'] as const) {
      total +=
        (await this.dataMos
          .updateTransportStations(type)
          ?.then((res) => res.count)) || 0;
    }
    return total;
  }

  // @Get('calculate-streets')
  // calculateStreets(): Promise<any> {
  //   return this.dataMos.calculateStreets(5000);
  // }
}
