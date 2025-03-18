import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '@urgp/server/database';
import { TelegramService } from '@urgp/server/telegram';
import {
  ApproveControlEntityDto,
  caseClassesValues,
  CaseFull,
  CasesPageFilter,
  Classificator,
  CreateCaseDto,
  CreateOperationDto,
  defineControlAbilityFor,
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  OperationClass,
  OperationFull,
  SelectOption,
  User,
  UserApproveTo,
  UserApproveToChainData,
  UserControlData,
  UserControlSettings,
  UserNotificationSettings,
  UserTelegramStatus,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';
import { from, map, tap, timeout } from 'rxjs';
// type GetCorectApproveDataOperationProps = {
//   user: User;
//   dto: ApproveControlEntityDto | CreateOperationDto | UpdateOperationDto;
//   isOperation: true;
// };

// type GetCorectApproveDataCaseProps = {
//   user: User;
//   dto: ApproveControlEntityDto | CreateCaseDto | UpdateCaseDto;
//   isOperation?: false | never;
// };

// type GetCorectApproveDataProps =
//   | GetCorectApproveDataOperationProps
//   | GetCorectApproveDataCaseProps;

type GetCorectApproveDataProps = {
  user: User;
  dto: ApproveControlEntityDto | CreateCaseDto | CreateOperationDto;
  isOperation?: boolean;
};

type ApproveData = Omit<ApproveControlEntityDto, 'id'> & {
  approveFromId: number;
  approveDate: string | null;
};

@Injectable()
export class ControlClassificatorsService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly telegram: TelegramService,
    // private readonly operations: ControlOperationsService,
    // private readonly cases: ControlCasesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron('0 15 8 * * 1-5')
  private async dailyStatusNotification() {
    const dailySubscriptions =
      await this.dbServise.db.renovationUsers.readDailySubscriptions();
    dailySubscriptions.forEach((id, index) => {
      setTimeout(() => this.telegram.sendUserStatus(id), index * 50);
    });
  }

  @Cron('0 0 8 * * 1')
  private async weelyStatusNotification() {
    const dailySubscriptions =
      await this.dbServise.db.renovationUsers.readWeeklySubscriptions();
    dailySubscriptions.forEach((id, index) => {
      setTimeout(() => this.telegram.sendUserStatus(id), index * 50);
    });
  }

  public async getControlData(userId: number): Promise<UserControlData> {
    return this.dbServise.db.renovationUsers.getControlData(userId);
  }

  public async getControlSettings(
    userId: number,
  ): Promise<UserControlSettings> {
    return this.dbServise.db.renovationUsers.getControlSettings(userId);
  }

  public async getTelegramStatus(
    userId: number,
  ): Promise<UserTelegramStatus | null> {
    return this.dbServise.db.renovationUsers.getUserTelegramStatus(userId);
  }

  public async setControlDirections(
    userId: number,
    directions: number[],
  ): Promise<UserControlSettings> {
    return this.dbServise.db.renovationUsers.setControlDirections(
      userId,
      directions,
    );
  }

  public async setCaseFilter(
    userId: number,
    filter: CasesPageFilter,
  ): Promise<UserControlSettings> {
    return this.dbServise.db.renovationUsers.setCaseFilter(userId, filter);
  }

  public async setNotificationsSettings(
    userId: number,
    notifications: UserNotificationSettings,
  ): Promise<UserControlSettings> {
    return this.dbServise.db.renovationUsers.setNotificationData(
      userId,
      notifications,
    );
  }

  public async getUserApproveTo(userId: number): Promise<UserApproveTo> {
    return this.dbServise.db.renovationUsers.getUserApproveTo(userId);
  }

  public async getUserApproveChains(
    userId: number,
  ): Promise<UserApproveToChainData[]> {
    return this.dbServise.db.renovationUsers.getUserApproveToChains(userId);
  }

  public async getControlExecutors(): Promise<SelectOption<number>[]> {
    return this.dbServise.db.renovationUsers.getControlExecutors();
  }

  public async readUserControlTo(
    userId: number,
  ): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.renovationUsers.readUserControlTo(userId);
  }

  public async getEscalationTargets(): Promise<SelectOption<number>[]> {
    return this.dbServise.db.renovationUsers.getEscalationTargets();
  }

  public async getCaseTypes(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readCaseTypes();
  }

  public async getOperationTypes(
    operationClass?: OperationClass,
  ): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readOperationTypes(
      operationClass,
    );
  }

  public async getOperationTypesFlat(
    operationClass?: OperationClass,
  ): Promise<Classificator[]> {
    return this.dbServise.db.controlClassificators.readOperationTypesFlat(
      operationClass,
    );
  }

  public async getCaseStatusTypes(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readCaseStatusTypes();
  }

  public async getCaseDirectionTypes(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readCaseDirectionTypes();
  }

  public async getDepartmentTypes(): Promise<NestedClassificatorInfoString[]> {
    return this.dbServise.db.controlClassificators.readDepartmentTypes();
  }

  public async getDirectionSubscribers(
    directions: number[],
  ): Promise<Classificator[]> {
    return this.dbServise.db.controlClassificators.readDirectionSubscribers(
      directions,
    );
  }

  public async isAutoApproved(dto?: any | null): Promise<boolean> {
    if (caseClassesValues.includes(dto?.class)) return false; // дела никогда не автоаппрувятся
    const typeId = dto && 'typeId' in dto ? dto.typeId : undefined;
    if (!typeId) return false;
    const operationTypes = await this.getOperationTypesFlat();
    return !!operationTypes.find((operation) => operation.id === typeId)
      ?.autoApprove;
  }

  public async getCorrectApproveData({
    user,
    dto,
    isOperation,
  }: GetCorectApproveDataProps): Promise<ApproveData> {
    const i = defineControlAbilityFor(user);
    const currentEntity =
      'id' in dto && dto?.id !== 0
        ? isOperation
          ? await this.dbServise.db.controlOperations
              .readOperations({ mode: 'slim', operation: [dto.id] }, user.id)
              .then((operations) => operations[0])
          : await this.dbServise.db.controlCases
              .readCases({ mode: 'slim', case: [dto.id] }, user.id)
              .then((cases) => cases[0])
        : dto;

    // Подгружаем сущность для определения прав на изменение
    // const entity = await this.getEntity(dto, isOperation);
    const autoApproved = await this.isAutoApproved(dto);

    if (autoApproved)
      return {
        // Сущность с типом, не требующим согласования, автоматически согласуется
        approveStatus: 'approved',
        approveFromId: user.id,
        approveToId: user.id,
        approveDate: new Date().toISOString(),
        approveNotes: dto?.approveNotes ?? 'Операция не требует согласования',
      };

    if (
      (!dto.approveToId || dto.approveToId === 0) &&
      dto.approveStatus !== 'rejected'
      // || dto?.approveStatus === 'project'
    )
      return {
        // Проект не направляется на согласование
        approveStatus: 'project',
        approveFromId: user.id,
        approveToId: null,
        approveDate: null,
        approveNotes: dto?.approveNotes ?? null,
      };

    if (i.cannot('set-approver', dto)) {
      throw new UnauthorizedException(
        'Выбранный согласующий недоступен пользователю',
      );
    }

    if (
      dto.approveToId !== user.id &&
      !['approved', 'rejected'].includes(dto?.approveStatus || 'pending')
    )
      return {
        // Направлено указанному согласующему
        approveStatus: 'pending',
        approveFromId: user.id,
        approveToId: dto.approveToId ?? null,
        approveDate: null,
        approveNotes: dto?.approveNotes ?? null,
      };

    if (i.cannot('approve', currentEntity)) {
      throw new UnauthorizedException(
        'Действие не разрешено. Нет прав на рассмотрение!',
      );
    }

    // Доп праверка на наличие прав принимать решения по родительскому делу
    if (isOperation && 'id' in dto) {
      const affectedCases = (await this.dbServise.db.controlCases.readCases(
        { mode: 'full', operation: [dto.id] },
        user.id,
      )) as CaseFull[];

      if (i.cannot('resolve', affectedCases?.[0])) {
        throw new UnauthorizedException(
          'Операция не разрешена. Решение по делу может принять только установившим высокий контроль.',
        );
      }
    }

    if (dto.approveStatus === 'rejected') {
      return {
        // Данные по отказному делу
        approveStatus: 'rejected',
        approveFromId: user.id,
        approveToId: dto?.approveToId || null, // Не забыть прокинуть сюда id направившего согл!
        approveDate: new Date().toISOString(),
        approveNotes: dto?.approveNotes ?? null,
      };
    } else if (dto.approveToId === user.id) {
      return {
        // Проект одобрен автором
        approveStatus: 'approved',
        approveFromId: user.id,
        approveToId: user.id,
        approveDate: new Date().toISOString(),
        approveNotes: dto?.approveNotes ?? 'Одоберно автором при создании',
      };
    }

    // throw new BadRequestException(
    //   'Непредвиденный сценарий согласования! Проверьте запрос',
    // );
    return {
      approveStatus: 'pending',
      approveFromId: user.id,
      approveToId: dto?.approveToId || null,
      approveDate: null,
      approveNotes: dto?.approveNotes ?? null,
    };
  }
}
