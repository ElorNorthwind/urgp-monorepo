import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  UserControlData,
  NestedClassificatorInfo,
  Classificator,
  UserControlApprovers,
  SelectOption,
  NestedClassificatorInfoString,
  UserControlSettings,
  CasesPageFilter,
  OperationClass,
  ApproveControlEntityDto,
  User,
  CreateCaseDto,
  UpdateCaseDto,
  CreateOperationDto,
  UpdateOperationDto,
  CaseFull,
  defineControlAbilityFor,
  OperationSlim,
  CaseSlim,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';
import { ControlOperationsService } from './control-operations.service';
import { ControlCasesService } from './control-cases.service';

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
  dto:
    | ApproveControlEntityDto
    | CreateCaseDto
    | UpdateCaseDto
    | CreateOperationDto
    | UpdateOperationDto;
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
    // private readonly operations: ControlOperationsService,
    // private readonly cases: ControlCasesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getControlData(userId: number): Promise<UserControlData> {
    return this.dbServise.db.renovationUsers.getControlData(userId);
  }

  public async getControlSettings(
    userId: number,
  ): Promise<UserControlSettings> {
    return this.dbServise.db.renovationUsers.getControlSettings(userId);
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

  public async getUserApprovers(userId: number): Promise<UserControlApprovers> {
    return this.dbServise.db.renovationUsers.getUserApprovers(userId);
  }

  public async getControlExecutors(): Promise<SelectOption<number>[]> {
    return this.dbServise.db.renovationUsers.getControlExecutors();
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

  async getEntity(dto: any, isOperation?: boolean) {
    if ('id' in dto) {
      return isOperation
        ? ((await this.dbServise.db.controlOperations.readOperation(
            { operation: dto.id, class: 'all' },
            'slim',
          )) as OperationSlim)
        : ((await this.dbServise.db.controlCases.readSlimCase(
            dto.id,
          )) as CaseSlim);
    }
    return null;
  }

  // private async isAutoApproved(typeId: number | undefined): Promise<boolean> {

  //   // const typeId =
  //   //   entity && 'typeId' in entity
  //   //     ? entity.typeId
  //   //     : 'typeId' in dto
  //   //       ? dto.typeId
  //   //       : undefined;

  //   if (!typeId) return false;
  //   const operationTypes = await this.getOperationTypesFlat();
  //   return !!operationTypes.find((operation) => operation.id === typeId)
  //     ?.autoApprove;
  // }

  public async isAutoApproved(
    // entity?: CaseSlim | OperationSlim | null,
    dto?: any | null,
  ): Promise<boolean> {
    const typeId =
      // entity && 'typeId' in entity
      //   ? entity.typeId
      //   :
      dto && 'typeId' in dto ? dto.typeId : undefined;
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

    // Подгружаем сущность для определения прав на изменение
    const entity = await this.getEntity(dto, isOperation);
    const autoApproved = await this.isAutoApproved(dto);

    if (autoApproved)
      return {
        // Сущность с типом, не требующим согласования, автоматически согласуется
        approveStatus: 'approved',
        approveFromId: user.id,
        approveToId: user.id,
        approveDate: new Date().toISOString(),
        approveNotes: 'Операция не требует согласования',
      };

    if (
      !dto.approveToId ||
      dto.approveToId === 0 ||
      dto?.approveStatus === 'project'
    )
      return {
        // Проект не направляется на согласование
        approveStatus: 'project',
        approveFromId: user.id,
        approveToId: null,
        approveDate: null,
        approveNotes: null,
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
        approveNotes: null,
      };

    if (i.cannot('approve', dto)) {
      throw new UnauthorizedException(
        'Действие не разрешено. Нет прав на рассмотрение!',
      );
    }

    // Доп праверка на наличие прав принимать решения по родительскому делу
    if (
      isOperation &&
      entity &&
      (entity as OperationSlim)?.caseId &&
      (dto as UpdateOperationDto)?.id
    ) {
      const affectedCase = (await this.dbServise.db.controlCases.readFullCase(
        (entity as OperationSlim).caseId,
        user.id,
      )) as CaseFull;
      if (i.cannot('resolve', affectedCase)) {
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
        approveNotes: dto?.approveNotes || null,
      };
    } else if (dto.approveToId === user.id) {
      return {
        // Проект одобрен автором
        approveStatus: 'approved',
        approveFromId: user.id,
        approveToId: user.id,
        approveDate: new Date().toISOString(),
        approveNotes: 'Одоберно автором при создании',
      };
    }

    throw new BadRequestException(
      'Непредвиденный сценарий согласования! Проверьте запрос',
    );
    // return {
    //   // Этот случай не будет отрабатывать
    //   approveStatus: 'pending',
    //   approveFromId: user.id,
    //   approveToId: dto?.approveToId || null,
    //   approveDate: null,
    //   approveNotes: null,
    // };
  }
}
