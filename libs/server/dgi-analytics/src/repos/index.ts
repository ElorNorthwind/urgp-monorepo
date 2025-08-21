import { VksRepository } from './vks';

// Database Interface Extensions:
interface DbExtensions {
  vks: VksRepository;
}

export { DbExtensions, VksRepository };
