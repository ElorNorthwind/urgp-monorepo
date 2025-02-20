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
  | 'escalate'
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
  'control-problem': 'Case',
  dispatch: 'Dispatch',
  reminder: 'Reminder',
};

export const CONTROL_THRESHOLD = 3;

export function defineControlAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(
    createMongoAbility<[Action, Subject], MongoQuery>,
  );

  const approveTo = user.controlData.approveTo || [];

  if (user?.controlData?.roles?.includes('admin')) {
    can('manage', 'all'); // админу по дефолту можно все

    cannot('approve', 'all', {
      approveStatus: { $eq: 'approved' }, // решение по согласованным делам может принимать только согласовант
    });

    can('approve', 'all', {
      approveStatus: { $eq: 'project' },
      'author.id': { $eq: user.id },
    });

    can('approve', 'all', {
      approveStatus: { $eq: 'project' },
      authorId: { $eq: user.id },
    });

    // return build({
    //   detectSubjectType: (item) =>
    //     (subjectVariants?.[item?.class as keyof typeof subjectVariants] ||
    //       'unknown') as ExtractSubjectType<Subject>,
    // });
  }

  can(['read', 'create'], 'all'); // Все могут читать или создавать все
  can(['update', 'delete'], 'all', {
    'author.id': { $eq: user.id }, // FE // Все могу менять или удалять то, что они создали
  });
  can(['update', 'delete'], 'all', {
    authorId: { $eq: user.id }, // BE // Все могу менять или удалять то, что они создали
  });
  can(['update', 'approve'], 'all', {
    'approveTo.id': { $eq: user.id }, // FE // Все могут менять или согласовывать то, что у них на согле
  });
  can(['update', 'approve'], 'all', {
    approveToId: { $eq: user.id }, // BE // Все могут менять или согласовывать то, что у них на согле
  });

  cannot('update', 'all', {
    approveStatus: { $ne: 'pending' }, // согласовывать то что не на согласовании йо
  });

  can('update', 'Case', {
    dispatches: { $elemMatch: { 'controlTo.id': { $eq: user.id } } },
    // dispatches: { $elemMatch: { class: { $eq: 'dispatch' } } },
    // { 'cities.address': { $elemMatch: { postalCode: { $regex: /^AB/ } } } } // (4)
  });

  can('update', 'Case', {
    'author.id': { $eq: user.id },
    // dispatches: { $elemMatch: { class: { $eq: 'dispatch' } } },
    // { 'cities.address': { $elemMatch: { postalCode: { $regex: /^AB/ } } } } // (4)
  });

  // cannot('create', 'Dispatch');
  can('update', 'Dispatch', { controllerId: { $eq: user.id } }); // FORM Можно менять поручения, которые ты контролируешь
  can('update', 'Dispatch', { controlFromId: { $eq: user.id } }); // BE Можно менять поручения, которые ты контролируешь
  can('update', 'Dispatch', { 'controlFrom.id': { $eq: user.id } }); // FE Можно менять поручения, которые ты контролируешь
  // cannot('create', 'Reminder', { type: { $eq: 12 } }); // Нельзя создавать направления боссу ПОДУМАЙ
  can('create', 'Reminder', { type: { $eq: 11 } }); // Можно создавать напоминалки
  can('update', 'Reminder', { controlToId: { $eq: user.id } }); // BE Можно менять свои напоминалки
  can('update', 'Reminder', { controlFromId: { $eq: user.id } }); // FE Можно менять свои напоминалки
  can('update', 'Reminder', { 'controlTo.id': { $eq: user.id } }); // BE Можно менять свои напоминалки
  can('update', 'Reminder', { 'controlFrom.id': { $eq: user.id } }); // FE Можно менять свои напоминалки
  can('resolve', 'Case', {
    controllerIds: {
      $elemMatch: { $eq: user.id },
    },
  }); // Решение по делу уровня контроля выше заданного порога может принять только контролер
  can('resolve', 'Case', {
    controlLevel: { $lt: CONTROL_THRESHOLD },
  }); // Решение по делу уровня контроля ниже заданного могут принимать все (с поправкой на иные права)

  if (
    user?.controlData?.roles?.includes('executor') ||
    user?.controlData?.roles?.includes('boss')
  ) {
    can('create', 'Dispatch'); // начальники могут создавать поручения
    can('create', 'Reminder', { type: { $eq: 12 } }); // Начальники могут создавать направления боссу
  }

  if (user?.controlData?.roles?.includes('executor')) {
    can('escalate', 'all'); // начальники могут поднимать вопрос на уровень босса
  }

  if (user?.controlData?.roles?.includes('controller')) {
    can('read-all', 'all'); // контроллер видит все
  }

  can('approve', 'all', {
    'approveTo.id': { $eq: user.id },
  });

  can('approve', 'all', {
    approveToId: { $eq: user.id },
  });

  cannot('approve', 'all', {
    approveStatus: { $eq: 'approved' }, // решение по согласованным делам может принимать только согласовант
  });

  // cannot('approve', 'all', {
  //   approveStatus: { $eq: 'project' }, // нельзя согласовывать что еще в проекте и не за твоим авторством
  // });

  can('approve', 'all', {
    approveStatus: { $eq: 'project' },
    'author.id': { $eq: user.id },
  });

  can('approve', 'all', {
    approveStatus: { $eq: 'project' },
    authorId: { $eq: user.id },
  });

  // can('set-approver', 'all', {
  //   approveToId: null, // без согласующего можно создавать все
  // });

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
