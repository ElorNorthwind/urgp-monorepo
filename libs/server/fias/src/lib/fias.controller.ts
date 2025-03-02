import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FiasService } from './fias.service';
import { AccessTokenGuard } from '@urgp/server/auth';
import { FiasAddress, FiasHint } from '../config/types';

@Controller('fias')
@UseGuards(AccessTokenGuard)
export class FiasController {
  constructor(private readonly fias: FiasService) {}
  @Get('hint')
  getAddressHint(@Query('q') q: string): Promise<FiasHint> {
    if (!q || q.length === 0)
      throw new BadRequestException('Нужно указать искомый адрес');
    return this.fias.getAddressHint(q);
  }
  @Get('address')
  getAddress(@Query('q') q: string): Promise<FiasAddress> {
    if (!q || q.length === 0)
      throw new BadRequestException('Нужно указать искомый адрес');
    return this.fias.getAddress(q);
  }
}
