import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { DaDataService } from './dadata.service';
import { DaDataResult } from '@urgp/shared/entities';

@Controller('dadata')
@UseGuards(AccessTokenGuard)
export class DaDataController {
  constructor(private readonly dadata: DaDataService) {}

  @Get('by-address')
  getFiasGuidByAddressString(@Query('q') q: string): Promise<DaDataResult> {
    if (!q || q.length === 0)
      throw new BadRequestException('Нужно указать искомый адрес');
    return this.dadata.getFiasGuidByAddressString(q);
  }

  // @Get('calculate-streets')
  // calculateStreets(): Promise<any> {
  //   return this.dataMos.calculateStreets(5000);
  // }
}
