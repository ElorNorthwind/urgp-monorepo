import { CasesRepository } from './cases';
import { UsersRepository } from './users';
import { QuestionsRepository } from './questions';
import { StreetsRepository } from './streets';
import { RenovationRepository } from './renovation';
import { RenovationUsersRepository } from './renovationUsers';
import { ControlCasesRepository } from './control-cases';
import { ControlOperationsRepository } from './control-operations';
import { ControlClassificatorsRepository } from './control-classificators';
import { AddressRepository } from './address';

// Database Interface Extensions:
interface DbExtensions {
  users: UsersRepository;
  cases: CasesRepository;
  questions: QuestionsRepository;
  streets: StreetsRepository;
  renovation: RenovationRepository;
  renovationUsers: RenovationUsersRepository;
  controlCases: ControlCasesRepository;
  controlOperations: ControlOperationsRepository;
  controlClassificators: ControlClassificatorsRepository;
  address: AddressRepository;
}

export {
  DbExtensions,
  UsersRepository,
  CasesRepository,
  QuestionsRepository,
  StreetsRepository,
  RenovationRepository,
  RenovationUsersRepository,
  ControlCasesRepository,
};
