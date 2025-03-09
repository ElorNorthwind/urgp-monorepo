import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { AddressService } from './address.service';
import {
  CreateAddressSessionDto,
  createAddressSessionSchema,
  defineControlAbilityFor,
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
    const { addresses, ...rest } = dto;

    if (!addresses || addresses.length === 0)
      throw new BadRequestException('Требуется список адресов');

    const sessionId = await this.sessions.createSession(rest, req.user.id);
    const unfinishedAddresses = await this.address.addSessionAddresses(
      addresses,
      sessionId,
    );
    return unfinishedAddresses;
  }

  @Post('session/reset-errors')
  async restartSessionById(
    @Req() req: RequestWithUserData,
    @Body('id', ParseIntPipe) id: number,
  ) {
    const session = await this.sessions.getSessionById(id);
    if (!session) return null;
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('update', session))
      throw new UnauthorizedException('Нет прав на изменение сессии');

    return this.sessions.resetSessionErrors(id);
  }

  @Patch('session')
  async updateAddressSession(
    @Body(new ZodValidationPipe(updateAddressSessionSchema))
    dto: UpdateAddressSessionDto,
  ) {
    return this.sessions.updateSession(dto);
  }

  @Get('session-queue')
  getSessionsQueue() {
    return this.sessions.getActiveSession();
  }

  @Get('session/:id')
  async getSession(@Param('id', ParseIntPipe) id: number) {
    return this.sessions.getSessionById(id);
  }

  @Get('results/:id')
  async getSessionResults(@Param('id', ParseIntPipe) id: number) {
    return this.address.getAddressResultsBySessionId(id);
  }

  @Get('user-sessions')
  async getSessionsByUserId(@Req() req: RequestWithUserData) {
    return this.sessions.getSessionsByUserId(req.user.id);
  }

  @Post('session/refresh-queue')
  refreshSessionsQueue() {
    return this.sessions.refreshSessionQueue();
  }

  @Get('rates-usage')
  async getFiasDailyUsage() {
    return this.address.getFiasDailyUsage();
  }

  @Delete('session')
  async deleteSession(
    @Req() req: RequestWithUserData,
    @Body('id', ParseIntPipe) id: number,
  ) {
    const session = await this.sessions.getSessionById(id);
    if (!session) return null;
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('delete', session))
      throw new UnauthorizedException('Нет прав на удаление сессии');
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
