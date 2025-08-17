import { AbilityBuilder, createMongoAbility, MongoQuery } from '@casl/ability';
import { User } from './types';

type Action = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'manage';
type Subject =
  | 'VksCase'
  | 'VksCaseRequest'
  | 'VksCaseDecision'
  | 'unknown'
  | 'all';

export const vksSubjectVariants = {
  case: 'VksCase',
  request: 'VksCaseRequest',
  decision: 'VksCaseDecision',
};

export function defineVksAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(
    createMongoAbility<[Action, Subject], MongoQuery>,
  );

  if (user?.controlData?.roles?.includes('vks-admin')) {
    can('manage', 'all'); // админу по дефолту можно все
    return build({
      // detectSubjectType: (item) =>
      //   (vksSubjectVariants?.[
      //     item?.class as keyof typeof vksSubjectVariants
      //   ] || 'unknown') as ExtractSubjectType<Subject>,
    });
  }

  if (user?.controlData?.roles?.includes('vks-manager')) {
    can(['create', 'update'], 'VksCaseRequest');
    return build();
  }

  can(['read', 'create'], 'all'); // Все могут читать или создавать все

  return build();
}
