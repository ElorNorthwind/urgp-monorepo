import { UnchangedResolution } from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { letters } from './sql/sql';

// @Injectable()
export class LettersRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  getUnchangedResolutions(): Promise<UnchangedResolution[]> {
    return this.db.any(letters.getUnchangedResolutions);
  }
}
