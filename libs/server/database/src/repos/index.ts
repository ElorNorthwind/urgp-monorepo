import { CasesRepository } from './cases';
import { UsersRepository } from './users';
import { QuestionsRepository } from './questions';
import { StreetsRepository } from './streets';
import { RenovationRepository } from './renovation';
import { RenovationUsersRepository } from './renovationUsers';

// Database Interface Extensions:
interface DbExtensions {
  users: UsersRepository;
  cases: CasesRepository;
  questions: QuestionsRepository;
  streets: StreetsRepository;
  renovation: RenovationRepository;
  renovationUsers: RenovationUsersRepository;
}

export {
  DbExtensions,
  UsersRepository,
  CasesRepository,
  QuestionsRepository,
  StreetsRepository,
  RenovationRepository,
  RenovationUsersRepository,
};
