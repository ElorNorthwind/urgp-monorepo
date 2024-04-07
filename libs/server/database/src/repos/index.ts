import { CasesRepository } from './cases';
import { UsersRepository } from './users';
import { QuestionsRepository } from './questions';
import { StreetsRepository } from './streets';

// Database Interface Extensions:
interface DbExtensions {
  users: UsersRepository;
  cases: CasesRepository;
  questions: QuestionsRepository;
  streets: StreetsRepository;
}

export {
  DbExtensions,
  UsersRepository,
  CasesRepository,
  QuestionsRepository,
  StreetsRepository,
};
