import { RenovationRepository } from './renovation';
import { RenovationSyncRepository } from './renovation-sync';

// Database Interface Extensions:
interface DbExtensions {
  renovation: RenovationRepository;
  renovationSync: RenovationSyncRepository;
}

export { DbExtensions, RenovationRepository, RenovationSyncRepository };
