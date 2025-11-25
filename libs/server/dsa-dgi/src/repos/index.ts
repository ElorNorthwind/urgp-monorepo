import { RenovationRepository } from './renovation';

// Database Interface Extensions:
interface DbExtensions {
  renovation: RenovationRepository;
}

export { DbExtensions, RenovationRepository };
