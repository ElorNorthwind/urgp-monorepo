import {
  AbilityBuilder,
  createMongoAbility,
  MongoQuery,
  ExtractSubjectType,
} from '@casl/ability';
import { User } from './types';
import {
  ControlDispatch,
  ControlDispatchSlim,
  ControlReminder,
  ControlReminderSlim,
  ControlStage,
  ControlStageSlim,
} from '../operations/types';
import { Case, CaseSlim } from '../cases/types';
import { CaseCreateDto, CaseFormValuesDto, CaseUpdateDto } from '../cases/dto';
import {
  ControlStageCreateDto,
  ControlStageFormValuesDto,
  ControlStageUpdateDto,
  DispatchCreateDto,
  DispatchUpdateDto,
  ReminderCreateDto,
  ReminderUpdateDto,
} from '../operations/dto';

type Action =
  | 'create'
  | 'read'
  | 'read-all'
  | 'update'
  | 'delete'
  | 'approve'
  | 'set-approver'
  | 'manage';
type Subject =
  | 'Case'
  | Case
  | CaseSlim
  | CaseCreateDto
  | CaseUpdateDto
  | 'Stage'
  | ControlStage
  | ControlStageSlim
  | ControlStageCreateDto
  | ControlStageUpdateDto
  | 'Dispatch'
  | ControlDispatch
  | ControlDispatchSlim
  | DispatchCreateDto
  | DispatchUpdateDto
  | 'Reminder'
  | ControlReminder
  | ControlReminderSlim
  | ReminderCreateDto
  | ReminderUpdateDto
  | 'unknown'
  | 'all';

const subjectMap = {
  stage: 'ControlStage',
  'control-incident': 'Case',
};

export function defineControlAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(
    createMongoAbility<[Action, Subject], MongoQuery>,
  );

  const caseApprovers = user.controlData.approvers?.cases || [];
  const operationApprovers = user.controlData.approvers?.operations || [];

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
      'payload.approver.id': { $eq: user.id }, // FE // Все могут менять или согласовывать то, что у них на согле
    });
    can(['update', 'approve'], 'all', {
      'payload.approverId': { $eq: user.id }, // BE // Все могут менять или согласовывать то, что у них на согле
    });
    cannot('update', 'all', {
      'payload.approveStatus': { $ne: 'pending' }, // нельзя согласовывать или менять то что не на согласовании йо
    });
    cannot('create', 'Dispatch');
    can('update', 'Dispatch', { 'payload.controllerId': { $eq: user.id } }); // BE Можно менять поручения, которые ты контролируешь
    can('update', 'Dispatch', { 'payload.controller.id': { $eq: user.id } }); // FE Можно менять поручения, которые ты контролируешь
    can('update', 'Reminder', { 'payload.observerId': { $eq: user.id } }); // BE Можно менять свои напоминалки
    can('update', 'Reminder', { 'payload.observer.id': { $eq: user.id } }); // FE Можно менять свои напоминалки
  }

  if (
    user?.controlData?.roles?.includes('executor') ||
    user?.controlData?.roles?.includes('boss')
  ) {
    can('create', 'Dispatch'); // начальники могут создавать поручения
  }

  if (user?.controlData?.roles?.includes('controller')) {
    can('read-all', 'all'); // контроллер видит все
  }

  cannot('approve', 'all', {
    'payload.approveStatus': { $ne: 'pending' }, // нельзя согласовывать или менять то что не на согласовании йо
  });
  can('set-approver', 'all', {
    approverId: null, // без согласующего можно создавать все
  });
  can('set-approver', 'Case', {
    approverId: { $in: caseApprovers }, // Никто не может создавать или ставить дела на утверждении не своих согласующих
  });
  can('set-approver', 'Stage', {
    approverId: { $in: operationApprovers }, // Никто не может создавать или ставить операции на утверждении не своих согласующих
  });

  return build({
    detectSubjectType: (item) =>
      (subjectMap?.[item?.class as keyof typeof subjectMap] ||
        'unknown') as ExtractSubjectType<Subject>,
  });
}
