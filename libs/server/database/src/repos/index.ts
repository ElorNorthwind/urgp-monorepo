import { CasesRepository } from './cases';
import { UsersRepository } from './users';
import { QuestionsRepository } from './questions';
import { StreetsRepository } from './streets';
import { RenovationUsersRepository } from './renovationUsers';
import { ControlCasesRepository } from './control-cases';
import { ControlOperationsRepository } from './control-operations';
import { ControlClassificatorsRepository } from './control-classificators';
import { AddressRepository } from './address';
import { EquityRepository } from './equity';
import { SudirRepository } from './sudir';
import { LettersRepository } from './letters';

// Database Interface Extensions:
interface DbExtensions {
  users: UsersRepository;
  cases: CasesRepository;
  questions: QuestionsRepository;
  streets: StreetsRepository;
  renovationUsers: RenovationUsersRepository;
  controlCases: ControlCasesRepository;
  controlOperations: ControlOperationsRepository;
  controlClassificators: ControlClassificatorsRepository;
  address: AddressRepository;
  equity: EquityRepository;
  sudir: SudirRepository;
  letters: LettersRepository;
}

export {
  DbExtensions,
  UsersRepository,
  CasesRepository,
  QuestionsRepository,
  StreetsRepository,
  RenovationUsersRepository,
  ControlCasesRepository,
  ControlOperationsRepository,
  ControlClassificatorsRepository,
  AddressRepository,
  EquityRepository,
  SudirRepository,
  LettersRepository,
};
