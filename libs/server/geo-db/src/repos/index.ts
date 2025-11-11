import { DataMosRepository } from './data-mos';

// Database Interface Extensions:
interface DbExtensions {
  dataMos: DataMosRepository;
}

export { DbExtensions, DataMosRepository };
