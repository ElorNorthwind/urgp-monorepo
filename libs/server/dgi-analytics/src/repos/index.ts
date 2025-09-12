import { DmRepository } from './dm';
import { VksRepository } from './vks';

// Database Interface Extensions:
interface DbExtensions {
  vks: VksRepository;
  dm: DmRepository;
}

export { DbExtensions, VksRepository, DmRepository };
