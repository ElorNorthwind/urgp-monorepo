import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RenovationService } from './renovation.service';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  CityTotalDeviations,
  ConnectedPlots,
  CreateMessageDto,
  DeleteMessageDto,
  DoneTimelinePoint,
  getOldApartments,
  GetOldAppartmentsDto,
  getOldBuldings,
  GetOldBuldingsDto,
  messagesUnanswered,
  MessagesUnansweredDto,
  OkrugTotals,
  OldApartmentDetails,
  OldApartmentTimeline,
  OldAppartment,
  OldBuilding,
  OldBuildingRelocationMapElement,
  RequestWithUserData,
  UnansweredMessage,
  UpdateMessageDto,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { z } from 'zod';

@Controller('renovation')
export class RenovationController {
  constructor(private readonly renovation: RenovationService) {}

  @Get('old-geojson')
  getOldGeoJson(): Promise<unknown[]> | unknown[] {
    return this.renovation.getOldBuildingsGeoJson();
  }

  @Get('old-buildings')
  @UsePipes(new ZodValidationPipe(getOldBuldings))
  getOldBuldings(
    @Query() getOldHousesDto: GetOldBuldingsDto,
  ): Promise<OldBuilding[]> {
    return this.renovation.getOldBuildings(getOldHousesDto);
  }

  @Get('old-apartments')
  @UsePipes(new ZodValidationPipe(getOldApartments))
  getOldAppartments(
    @Query() getOldAppartmentsDto: GetOldAppartmentsDto,
  ): Promise<OldAppartment[]> {
    return this.renovation.getOldAppartments(getOldAppartmentsDto);
  }

  @Get('okrug-totals')
  getOkrugTotals(): Promise<OkrugTotals[]> {
    return this.renovation.getOkrugTotals();
  }

  @Get('done-timeline')
  getDoneTimeline(): Promise<DoneTimelinePoint[]> {
    return this.renovation.getDoneTimeline();
  }

  @Get('old-apartment-timeline/:id')
  getOldApartmentTimeline(
    @Param('id') id: number,
  ): Promise<OldApartmentTimeline[]> {
    return this.renovation.getOldApartmentTimeline(id);
  }

  @Get('old-apartment-details/:id')
  getOldApartmentDetails(
    @Param('id') id: number,
  ): Promise<OldApartmentDetails> {
    return this.renovation.getOldApartmentsDetails(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post('message')
  createMessage(
    @Req() req: RequestWithUserData,
    @Body() dto: CreateMessageDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL
    const id = req.user.id;
    if (id !== dto.authorId) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нельзя создавать сообщения от имени другого пользователя!',
      );
    }
    return this.renovation.createMessage(dto);
  }

  @Get('message/apartment')
  readApartmentMessages(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ) {
    if (ids.length === 0) {
      return [];
    }
    return this.renovation.readApartmentMessages({
      apartmentIds: ids as [number, ...number[]],
    });
  }

  @UseGuards(AccessTokenGuard)
  @Patch('message')
  async updateMessage(
    @Req() req: RequestWithUserData,
    @Body() dto: UpdateMessageDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL
    const userId = req.user.id;
    const { authorId } = await this.renovation.readMessageById({
      id: dto.id,
    });
    if (userId !== authorId) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нельзя менять сообщения другого пользователя!',
      );
    }

    return this.renovation.updateMessage(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('message')
  async deleteMessage(
    @Req() req: RequestWithUserData,
    @Body() dto: DeleteMessageDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL
    if (!req.user.roles.includes('admin')) {
      const userId = req.user.id;
      const { authorId } = await this.renovation.readMessageById({
        id: dto.id,
      });
      if (userId !== authorId) {
        throw new UnauthorizedException(
          'Операция не разрешена. Только администратор может удалять чужие сообщения !',
        );
      }
    }

    return this.renovation.deleteMessage(dto);
  }

  @Get('connected-plots/:id')
  getConnectedPlots(@Param('id') id: number): Promise<ConnectedPlots[]> {
    return this.renovation.getConnectedPlots(id);
  }

  @Get('total-deviations')
  async getCityTotalDeviations(): Promise<CityTotalDeviations> {
    const { result } = await this.renovation.getCityTotalDeviations();
    return result;
  }

  @Get('last-updated-date')
  async getLastUpdatedDate(): Promise<Date> {
    const { date } = await this.renovation.getLastUpdatedDate();
    return date;
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(new ZodValidationPipe(messagesUnanswered as any))
  @Get('unanswered-messages/:user')
  async getUnansweredMessages(
    @Req() req: RequestWithUserData,
    @Param('user') user: MessagesUnansweredDto,
  ): Promise<UnansweredMessage[]> {
    if (
      user === 'all' &&
      ['admin', 'editor', 'boss'].filter((role) =>
        req.user.roles.includes(role),
      ).length === 0
    ) {
      throw new UnauthorizedException('Нет прав на просмотр всех сообщений');
    }

    return this.renovation.getUnansweredMessages(user);
  }

  @Get('old-building-list')
  getOldBuildingList(): Promise<{ value: number; label: string }[]> {
    return this.renovation.getOldBuildingList();
  }

  @Get('old-building-relocation-map/:id')
  getOldBuildingRelocationMap(
    @Param('id') id: number,
  ): Promise<OldBuildingRelocationMapElement[]> {
    return this.renovation.getOldBuildingRelocationMap(id);
  }
}

// @Query() getOldAppartmentsDto: GetOldAppartmentsDto,
