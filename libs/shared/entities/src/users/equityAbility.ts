import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  MongoQuery,
} from '@casl/ability';
import { User } from './types';
import {
  CreateEquityOperationDto,
  UpdateEquityOperationDto,
} from '../equityOperations/dto';
import { EquityOperation } from '../equityOperations/types';

type Action = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'manage';
type Subject =
  | 'EquityOperation'
  | EquityOperation
  | CreateEquityOperationDto
  | UpdateEquityOperationDto
  | 'EquityClaim'
  | 'EquityObject'
  | 'unknown'
  | 'all';

export const equitySubjectVariants = {
  operation: 'EquityOperation',
  claim: 'EquityClaim',
  object: 'EquityObject',
};

export function defineEquityAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(
    createMongoAbility<[Action, Subject], MongoQuery>,
  );

  if (user?.controlData?.roles?.includes('admin')) {
    can('manage', 'all'); // админу по дефолту можно все

    return build({
      detectSubjectType: (item) =>
        (equitySubjectVariants?.[
          item?.class as keyof typeof equitySubjectVariants
        ] || 'unknown') as ExtractSubjectType<Subject>,
    });
  }

  can(['read', 'create'], 'all'); // Все могут читать или создавать все
  can(['update', 'delete'], 'all', {
    createdBy: { $eq: user.id }, // FE // Все могу менять или удалять то, что они создали
  });

  return build({
    detectSubjectType: (item) =>
      (equitySubjectVariants?.[
        item?.class as keyof typeof equitySubjectVariants
      ] || 'unknown') as ExtractSubjectType<Subject>,
  });
}
