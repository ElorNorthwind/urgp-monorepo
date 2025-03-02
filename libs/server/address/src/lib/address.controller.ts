import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { AddressService } from './address.service';

@Controller('address')
@UseGuards(AccessTokenGuard)
export class AddressController {
  constructor(private readonly address: AddressService) {}
}
