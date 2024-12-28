import {
  AbilityBuilder,
  createMongoAbility,
  MongoQuery,
  ExtractSubjectType,
} from '@casl/ability';
import { User } from './types';
import { ControlStage, ControlStageSlim } from '../operations/types';
import { Case, CaseSlim } from '../cases/types';
import { CaseCreateDto, CaseUpdateDto } from '../cases/dto';
import {
  ControlStageCreateDto,
  ControlStageUpdateDto,
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
  | Case
  | CaseSlim
  | CaseCreateDto
  | CaseUpdateDto
  | 'Case'
  | ControlStage
  | ControlStageSlim
  | ControlStageCreateDto
  | ControlStageUpdateDto
  | 'Stage'
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

  if (user.controlData.roles.includes('admin')) {
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
      'payload.approver': { $eq: user.id }, // BE // Все могут менять или согласовывать то, что у них на согле
    });
    cannot('update', 'all', {
      'payload.approveStatus': { $ne: 'pending' }, // нельзя согласовывать или менять то что не на согласовании йо
    });
  }

  if (user.controlData.roles.includes('controller')) {
    can('read-all', 'all'); // контроллер видит все
  }

  cannot('approve', 'all', {
    'payload.approveStatus': { $ne: 'pending' }, // нельзя согласовывать или менять то что не на согласовании йо
  });
  can('set-approver', 'all', {
    approver: null, // без согласующего можно создавать все
  });
  can('set-approver', 'Case', {
    approver: { $in: caseApprovers }, // Никто не может создавать или ставить дела на утверждении не своих согласующих
  });
  can('set-approver', 'Stage', {
    approver: { $in: operationApprovers }, // Никто не может создавать или ставить операции на утверждении не своих согласующих
  });

  return build({
    detectSubjectType: (item) =>
      (subjectMap?.[item?.class as keyof typeof subjectMap] ||
        'unknown') as ExtractSubjectType<Subject>,
  });
}
