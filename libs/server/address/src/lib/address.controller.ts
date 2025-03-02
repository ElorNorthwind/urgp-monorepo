import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { z } from 'zod';

@Controller('address')
@UseGuards(AccessTokenGuard)
export class AddressController {
  constructor(
    private readonly address: AddressService,
    private readonly sessions: AddressSessionsService,
  ) {}

  @Post('session')
  async createAddressSession(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(createAddressSessionSchema))
    dto: CreateAddressSessionDto,
  ) {
    return this.sessions.createSession(dto, req.user.id);
  }

  @Patch('session')
  async updateAddressSession(
    @Body(new ZodValidationPipe(updateAddressSessionSchema))
    dto: UpdateAddressSessionDto,
  ) {
    return this.sessions.updateSession(dto);
  }

  @Get('session/:id')
  async getSession(@Param('id', ParseIntPipe) id: number) {
    return this.sessions.getSessionById(id);
  }

  @Get('user-sessions')
  async getSessionsByUserId(@Req() req: RequestWithUserData) {
    return this.sessions.getSessionsByUserId(req.user.id);
  }

  @Delete('session')
  async deleteSession(@Body('id', ParseIntPipe) id: number) {
    return this.sessions.deleteSession(id);
  }
  @Delete('session/older-than')
  async deleteSessionsOlderThan(
    @Body(new ZodValidationPipe(z.object({ date: z.string().datetime() })))
    { date }: { date: string },
  ) {
    return this.sessions.deleteSessionsOlderThan(date);
  }
}
