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

  updateCaseNotificationDate(ids: number[]): Promise<number> {
    if (!ids || !ids.length) {
      return Promise.resolve(0);
    }

    const sql = this.pgp.as.format(
      `UPDATE public.cases c
SET need_resolution_change_notification_date = (CURRENT_TIMESTAMP)::timestamp(0) without time zone
WHERE c."CaseID" = ANY(ARRAY[$1:list]::bigint[]);`,
      [ids],
    );
    return this.db
      .none(sql)
      .then(() => 1)
      .catch(() => 0);
  }
}
