import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { AddressService } from './address.service';
import {
  CreateAddressSessionDto,
  createAddressSessionSchema,
  RequestWithUserData,
  UpdateAddressSessionDto,
  updateAddressSessionSchema,
} from '@urgp/shared/entities';
import { ZodValidationPipe } from '@urgp/server/pipes';
import { AddressSessionsService } from './address-sessions.service';

@Controller('address')
@UseGuards(AccessTokenGuard)
export class AddressController {
  constructor(
    private readonly address: AddressService,
    private readonly sessions: AddressSessionsService,
  ) {}

  @Post('session')
  async createSession(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(createAddressSessionSchema))
    dto: CreateAddressSessionDto,
  ) {
    return this.sessions.createSession(dto, req.user.id);
  }

  @Patch('session')
  async updateSession(
    @Body(new ZodValidationPipe(updateAddressSessionSchema))
    dto: UpdateAddressSessionDto,
  ) {
    console.log('w');
    return this.sessions.updateSession(dto);
  }
}
