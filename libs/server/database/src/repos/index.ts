import { CasesRepository } from './cases';
import { UsersRepository } from './users';
import { QuestionsRepository } from './questions';

// Database Interface Extensions:
interface DbExtensions {
  users: UsersRepository;
  cases: CasesRepository;
  questions: QuestionsRepository;
}

export { DbExtensions, UsersRepository, CasesRepository, QuestionsRepository };
