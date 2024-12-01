import { Case, CaseCreateDto } from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { cases } from './sql/sql';

// @Injectable()
export class ControlCasesRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  createCase(dto: CaseCreateDto, authorId: number): Promise<Case> {
    const externalCases =
      `jsonb_build_array(` +
      dto.externalCases
        .map((c) => {
          return this.pgp.as.format(
            `jsonb_build_object('id', $1, 'num', $2, 'date', $3, 'system', $4)`,
            [c.id, c.num, c.date, c.system],
          );
        })
        .join(', ') +
      `)`;
    const directions = this.pgp.as.format(`jsonb_build_array($1:list)`, [
      dto.directions,
    ]);
    const problems = this.pgp.as.format(`jsonb_build_array($1:list)`, [
      dto.problems,
    ]);

    const newCase = {
      authorId,
      externalCases,
      type: dto.type,
      directions,
      problems,
      description: dto.description,
      fio: dto.fio,
      adress: dto.adress,
      approver: dto.approver,
    };

    // const q = this.pgp.as.format(cases.createCase, newCase);
    // console.log(q);

    return this.db.one(cases.createCase, newCase);
  }
}
