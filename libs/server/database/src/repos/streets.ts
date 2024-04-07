import { IDatabase, IMain } from 'pg-promise';
import { DbStreet } from '../models/types';
import { GetStreetsDto } from '../models/dto/get-streets';

// @Injectable()
export class StreetsRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  // Returns all user records;
  all(): Promise<DbStreet[]> {
    return this.db.any(
      `SELECT id::varchar as value, label
       FROM public.bti_streets
       ORDER BY label Asc`,
    );
  }

  // Returns streets by query;
  byQuery({ query, limit = 20 }: GetStreetsDto): Promise<DbStreet[]> {
    return this.db.any(
      `SELECT id::varchar as value, label, (word_similarity(label, $<query>) * 100)::integer as similarity
       FROM public.bti_streets
       WHERE label %> $<query>
       ORDER BY word_similarity(label, $<query>) DESC
       LIMIT $<limit>`,
      { query, limit },
    );
  }
}
