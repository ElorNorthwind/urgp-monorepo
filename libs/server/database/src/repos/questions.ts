import { IDatabase, IMain, ColumnSet, PreparedStatement } from 'pg-promise';
import { DbQuestion } from '../models/types';
// import { Injectable } from '@nestjs/common';
import { SelectRenamedColumns } from '../lib/select-renamed-columns';
import { UpdateQuestionsDto } from '../models/dto/update-questions';
import { HttpException, HttpStatus } from '@nestjs/common';

const table = { table: 'new_question', schema: 'public' };
const columns = [
  { name: 'question_id', prop: 'id', cnd: true },
  { name: 'question_name', prop: 'questionName' },
  { name: 'theme_id', prop: 'themeId' },
  { name: 'question_text', prop: 'questionText' },
  { name: 'description_text', prop: 'descriptionText' },
  { name: 'yandex_embedding', prop: 'yandexEmbedding' },
];

// @Injectable()
export class QuestionsRepository {
  /**
   * @param db
   * Automated database connection context/interface.
   *
   * If you ever need to access other repositories from this one,
   * you will have to replace type 'IDatabase<any>' with 'any'.
   *
   * @param pgp
   * Library's root, if ever needed, like to access 'helpers'
   * or other namespaces available from the root.
   */

  private cs: ColumnSet<DbQuestion>;
  private columnSelector: string;

  constructor(
    private db: IDatabase<any>,
    private pgp: IMain,
  ) {
    this.cs = new pgp.helpers.ColumnSet(columns, {
      table,
    });

    this.columnSelector = SelectRenamedColumns(this.cs);
  }

  // Returns all questions;
  all(): Promise<DbQuestion[]> {
    return this.db.any(this.columnSelector);
  }

  // Returns all questions with descritpions;
  descriptioned(): Promise<DbQuestion[]> {
    return this.db.any(
      this.columnSelector + ' WHERE description_text IS NOT Null',
    );
  }

  // Returns all questions with descritpions but with no embeddings;
  unembedded(): Promise<DbQuestion[]> {
    return this.db.any(
      this.columnSelector +
        ' WHERE description_text IS NOT Null AND yandex_embedding IS Null',
    );
  }

  // Updates question records;
  update(questions: UpdateQuestionsDto): Promise<DbQuestion[]> {
    if (!questions || questions.length === 0) {
      throw new HttpException(
        'No update items provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cs = new this.pgp.helpers.ColumnSet(
      columns.filter((column) =>
        Object.keys(questions[0]).includes(column.prop),
      ),
      {
        table,
      },
    );

    const query =
      this.pgp.helpers.update(questions, cs, table) +
      ' WHERE v.question_id = t.question_id RETURNING t.*';
    try {
      return this.db.any(query);
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        'Failed to update question',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  byEmbeddings(emb: number[]): Promise<DbQuestion[]> {
    try {
      return this.db.any(
        `SELECT 
          question_id as id, 
          question_name as questionName, 
          theme_id as themeId,
          1 - (yandex_embedding <=> $1)::double precision as weight from ${table.schema}.${table.table} 
        ORDER BY yandex_embedding <=> $1 LIMIT 10`,
        [JSON.stringify(emb)],
      );
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        'Failed to load questions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
