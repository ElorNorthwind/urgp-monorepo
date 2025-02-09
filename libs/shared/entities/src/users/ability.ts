import {
  AbilityBuilder,
  createMongoAbility,
  MongoQuery,
  ExtractSubjectType,
} from '@casl/ability';
import { User } from './types';
import { OperationFull, OperationSlim } from '../operations/types';
import { CaseFull, CaseSlim } from '../cases/types';
// import { CaseCreateDto, CaseUpdateDto } from '../cases/dto';
// import {
//   ControlStageCreateDto,
//   ControlStageUpdateDto,
//   DispatchCreateDto,
//   DispatchUpdateDto,
//   ReminderCreateDto,
//   ReminderUpdateDto,
// } from '../operations/dto';
import { CreateCaseDto, UpdateCaseDto } from '../cases/dto';
import { CreateOperationDto, UpdateOperationDto } from '../operations/dto';

type Action =
  | 'create'
  | 'read'
  | 'read-all'
  | 'update'
  | 'delete'
  | 'approve'
  | 'set-approver'
  | 'resolve'
  | 'manage';
type Subject =
  | 'Case'
  | CaseFull
  | CaseSlim
  | CreateCaseDto
  | UpdateCaseDto
  | 'Stage'
  | 'Dispatch'
  | 'Reminder'
  | OperationFull
  | OperationSlim
  | CreateOperationDto
  | UpdateOperationDto
  | 'unknown'
  | 'all';

export const subjectVariants = {
  stage: 'Stage',
  'control-incident': 'Case',
  dispanch: 'Dispatch',
  reminder: 'Reminder',
};

export const CONTROL_THRASHOLD = 3;

export function defineControlAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(
    createMongoAbility<[Action, Subject], MongoQuery>,
  );

  const approveTo = user.controlData.approveTo || [];

  if (user?.controlData?.roles?.includes('admin')) {
    can('manage', 'all'); // админу по дефолту можно все
  } else {
    can(['read', 'create'], 'all'); // Все могут читать или создавать все
    can(['update', 'delete'], 'all', {
      'author.id': { $eq: user.id }, // FE // Все могу менять или удалять то, что они создали
    });
    can(['update', 'delete'], 'all', {
      authorId: { $eq: user.id }, // BE // Все могу менять или удалять то, что они создали
    });
    can(['update', 'approve'], 'all', {
      'payload.approveTo.id': { $eq: user.id }, // FE // Все могут менять или согласовывать то, что у них на согле
    });
    can(['update', 'approve'], 'all', {
      'payload.approveToId': { $eq: user.id }, // BE // Все могут менять или согласовывать то, что у них на согле
    });
    cannot('update', 'all', {
      'payload.approveStatus': { $ne: 'pending' }, // нельзя согласовывать или менять то что не на согласовании йо
    });
    // cannot('create', 'Dispatch');
    can('update', 'Dispatch', { controllerId: { $eq: user.id } }); // FORM Можно менять поручения, которые ты контролируешь
    can('update', 'Dispatch', { 'payload.controllerId': { $eq: user.id } }); // BE Можно менять поручения, которые ты контролируешь
    can('update', 'Dispatch', { 'payload.controller.id': { $eq: user.id } }); // FE Можно менять поручения, которые ты контролируешь
    can('create', 'Reminder', { type: { $eq: 11 } }); // Можно создавать напоминалки
    // cannot('create', 'Reminder', { type: { $eq: 12 } }); // Нельзя создавать направления боссу ПОДУМАЙ
    can('update', 'Reminder', { observerId: { $eq: user.id } }); // FORM Можно менять свои напоминалки
    can('update', 'Reminder', { 'payload.observee.id': { $eq: user.id } }); // BE Можно менять свои напоминалки
    can('update', 'Reminder', { 'payload.observerId': { $eq: user.id } }); // FE Можно менять свои напоминалки
    can('resolve', 'Case', {
      controllerIds: {
        $elemMatch: { $eq: user.id },
      },
    }); // Решение по делу уровня контроля выше заданного порога может принять только контролер
    can('resolve', 'Case', {
      controlLevel: { $lt: CONTROL_THRASHOLD },
    }); // Решение по делу уровня контроля ниже заданного могут принимать все (с поправкой на иные права)
  }

  if (
    user?.controlData?.roles?.includes('executor') ||
    user?.controlData?.roles?.includes('boss')
  ) {
    can('create', 'Dispatch'); // начальники могут создавать поручения
    can('create', 'Reminder', { type: { $eq: 12 } }); // Начальники могут создавать направления боссу
  }

  if (user?.controlData?.roles?.includes('controller')) {
    can('read-all', 'all'); // контроллер видит все
  }

  cannot('approve', 'all', {
    'payload.approveStatus': { $eq: 'approved' }, // нельзя согласовывать то что уже согласовано
  });

  cannot('approve', 'all', {
    'payload.approveStatus': { $eq: 'project' }, // нельзя согласовывать что еще в проекте
  });

  can('set-approver', 'all', {
    approveToId: null, // без согласующего можно создавать все
  });

  // can('set-approver', 'all', {
  //   approveToId: 0, // без согласующего можно создавать все
  // });

  can('set-approver', 'all', {
    approveToId: { $in: approveTo }, // Можно выставлять только доступных тебе согласующих
  });

  return build({
    detectSubjectType: (item) =>
      (subjectVariants?.[item?.class as keyof typeof subjectVariants] ||
        'unknown') as ExtractSubjectType<Subject>,
  });
}
