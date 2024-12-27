import {
  AbilityBuilder,
  MongoAbility,
  createMongoAbility,
  MongoQuery,
  ExtractSubjectType,
} from '@casl/ability';
import { User } from './types';
import { ControlStage } from '../operations/types';
import { Case } from '../cases/types';

// class Article {
//     id: number
//     title: string
//     content: string
//     authorId: number
//   }

type Action = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'manage';
type Subject = ControlStage | Case | 'Case' | 'ControlStage' | 'all';

type AppAbility = MongoAbility<[Action, Subject]>;

// type PossibleAbilities = [Action, Subject];
// type Conditions = MongoQuery;

// const ability = createMongoAbility<PossibleAbilities, Conditions>();

export function defineControlAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(
    createMongoAbility<[Action, Subject], MongoQuery>,
  );

  if (user.controlData.roles.includes('admin')) {
    can('manage', 'all'); // админу можно все
  } else {
    can(['read', 'create'], 'all'); // Все могут читать или создавать все
    can(['update', 'delete'], 'all', {
      'author.id': { $eq: user.id }, // Все могу менять или удалять то, что они создали
    });
    can(['update', 'approve'], 'all', {
      'payload.approver.id': { $eq: user.id }, // Все могут менять или согласовывать то, что у них на согле
    });
  }

  can('delete', 'Case', { payload: { authorId: user.id } });

  return build({
    detectSubjectType: (item) => item.class as ExtractSubjectType<Subject>,
  });
}
