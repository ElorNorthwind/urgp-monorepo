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
  UseInterceptors,
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
  messagesUnanswered,
  MessagesUnansweredDto,
  OkrugTotals,
  OldApartmentDetails,
  OldApartmentTimeline,
  OldAppartment,
  OldBuilding,
  BuildingRelocationMapElement,
  BuildingsGeoJSON,
  RequestWithUserData,
  UnansweredMessage,
  UpdateMessageDto,
  NewBuilding,
  CityTotalAgeInfo,
  StartTimelineInfo,
  DoneByYearInfo,
  OkrugTotalDeviations,
  ProblematicApartmentInfo,
  OldBuildingConnectionsInfo,
  CreateStageDto,
  messageCreate,
  messageUpdate,
  stageCreate,
  stageUpdate,
  messageDelete,
  UpdateStageDto,
  StageGroup,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { CacheInterceptor, CacheTTL, CacheKey } from '@nestjs/cache-manager';

@Controller('renovation')
export class RenovationController {
  constructor(private readonly renovation: RenovationService) {}

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('old-geojson')
  getOldGeoJson(): Promise<BuildingsGeoJSON> {
    return this.renovation.getOldBuildingsGeoJson();
  }

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('new-geojson')
  getNewGeoJson(): Promise<BuildingsGeoJSON> {
    return this.renovation.getNewBuildingsGeoJson();
  }
  @CacheTTL(1000 * 60 * 60)
  // @CacheKey('old-buildings')
  @UseInterceptors(CacheInterceptor)
  @Get('old-buildings')
  @UsePipes(new ZodValidationPipe(getOldBuldings))
  getOldBuldings(): Promise<OldBuilding[]> {
    return this.renovation.getOldBuildings();
  }

  @Get('old-building/:id')
  getOldBuildingById(@Param('id') id: number): Promise<OldBuilding | null> {
    return this.renovation.getOldBuildingById(id);
  }

  @Get('new-building/:id')
  getNewBuildingById(@Param('id') id: number): Promise<NewBuilding | null> {
    return this.renovation.getNewBuildingById(id);
  }

  @CacheTTL(1000 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('old-apartments')
  @UsePipes(new ZodValidationPipe(getOldApartments))
  getOldAppartments(
    @Query() getOldAppartmentsDto: GetOldAppartmentsDto,
  ): Promise<OldAppartment[]> {
    return this.renovation.getOldAppartments(getOldAppartmentsDto);
  }

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('okrug-totals')
  getOkrugTotals(): Promise<OkrugTotals[]> {
    return this.renovation.getOkrugTotals();
  }

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('okrug-total-deviations')
  getOrkugTotalDeviations(): Promise<OkrugTotalDeviations[]> {
    return this.renovation.getOkrugTotalDeviations();
  }

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
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
  // @UsePipes(new ZodValidationPipe(messageCreate))
  createMessage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(messageCreate)) dto: CreateMessageDto,
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
  // @UsePipes(new ZodValidationPipe(messageUpdate))
  async updateMessage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(messageUpdate)) dto: UpdateMessageDto,
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

    const hasRoles =
      req.user.roles.includes('admin') ||
      req.user.roles.includes('editor') ||
      req.user.roles.includes('boss');

    if (!hasRoles) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нехватает прав для редактирования сообщений!',
      );
    }

    return this.renovation.updateMessage(dto, userId);
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
      const hasRoles =
        req.user.roles.includes('admin') || req.user.roles.includes('boss');
      if (!hasRoles) {
        throw new UnauthorizedException(
          'Операция не разрешена. Нехватает прав для редактирования сообщений!',
        );
      }
    }

    return this.renovation.deleteMessage(dto, req.user.id);
  }

  @Get('connected-plots/:id')
  getConnectedPlots(@Param('id') id: number): Promise<ConnectedPlots[]> {
    return this.renovation.getConnectedPlots(id);
  }

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('total-deviations')
  async getCityTotalDeviations(): Promise<CityTotalDeviations> {
    const { result } = await this.renovation.getCityTotalDeviations();
    return result;
  }

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('total-ages')
  async getCityTotalAges(): Promise<CityTotalAgeInfo[]> {
    return this.renovation.getCityTotalAges();
  }

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('total-done-by-year')
  async getCityTotalDoneByYear(): Promise<DoneByYearInfo[]> {
    return this.renovation.getCityTotalDoneByYear();
  }

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('start-timeline')
  async getCityStartTimeline(): Promise<StartTimelineInfo[]> {
    return this.renovation.getCityStartTimeline();
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

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('old-building-list')
  getOldBuildingList(): Promise<{ value: number; label: string }[]> {
    return this.renovation.getOldBuildingList();
  }

  @Get('old-building-relocation-map/:id')
  getOldBuildingRelocationMap(
    @Param('id') id: number,
  ): Promise<BuildingRelocationMapElement[]> {
    return this.renovation.getOldBuildingRelocationMap(id);
  }

  @Get('new-building-relocation-map/:id')
  getNewBuildingRelocationMap(
    @Param('id') id: number,
  ): Promise<BuildingRelocationMapElement[]> {
    return this.renovation.getNewBuildingRelocationMap(id);
  }
  @Get('problematic-apartments/:id')
  getProblematicApartments(
    @Param('id') id: number,
  ): Promise<ProblematicApartmentInfo[]> {
    return this.renovation.getProblematicApartments(id);
  }
  @Get('old-building-connections/:id')
  getOldBuildingConnections(
    @Param('id') id: number,
  ): Promise<OldBuildingConnectionsInfo> {
    return this.renovation.getOldBuildingConnections(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post('stage')
  createStage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(stageCreate)) dto: CreateStageDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL
    const id = req.user.id;
    if (id !== dto.authorId) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нельзя создавать этапы от имени другого пользователя!',
      );
    }
    return this.renovation.createStage(dto);
  }

  @Get('stage/apartment')
  readApartmentStages(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ) {
    if (ids.length === 0) {
      return [];
    }
    return this.renovation.readApartmentStages({
      apartmentIds: ids as [number, ...number[]],
    });
  }

  @UseGuards(AccessTokenGuard)
  @Patch('stage')
  async updateStage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(stageUpdate)) dto: UpdateStageDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL
    const userId = req.user.id;
    const { authorId } = await this.renovation.readMessageById({
      id: dto.id,
    });
    if (userId !== authorId) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нельзя менять этапы другого пользователя!',
      );
    }

    // const hasRoles =
    //   req.user.roles.includes('admin') ||
    //   req.user.roles.includes('editor') ||
    //   req.user.roles.includes('boss');
    // if (!hasRoles) {
    //   throw new UnauthorizedException(
    //     'Операция не разрешена. Нехватает прав для редактирования сообщений!',
    //   );
    // }

    return this.renovation.updateStage(dto, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('stage')
  async deleteStage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(messageDelete)) dto: DeleteMessageDto,
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
      // const hasRoles =
      //   req.user.roles.includes('admin') || req.user.roles.includes('boss');
      // if (!hasRoles) {
      //   throw new UnauthorizedException(
      //     'Операция не разрешена. Нехватает прав для редактирования сообщений!',
      //   );
      // }
    }

    return this.renovation.deleteStage(dto, req.user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('reset-cache')
  resetRenovationCache(@Req() req: RequestWithUserData): void {
    if (
      !(
        req.user.roles.includes('admin') ||
        req.user.roles.includes('editor') ||
        req.user.roles.includes('boss')
      )
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нет прав для сброса кэша!',
      );
    }
    this.renovation.resetCache();
  }

  @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('stage/groups')
  getStageGroups(): Promise<StageGroup[]> {
    return this.renovation.getStageGroups();
  }
}
