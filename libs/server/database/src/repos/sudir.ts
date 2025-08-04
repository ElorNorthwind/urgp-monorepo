import { IDatabase, IMain } from 'pg-promise';

// @Injectable()
export class SudirRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  getUserCredentials(
    userId: number,
  ): Promise<{ login: string; password: string } | null> {
    const query =
      'SELECT sudir_login as login, sudir_password as password FROM public.users WHERE "UserID" = $1;';
    return this.db.oneOrNone(query, userId);
  }
}
