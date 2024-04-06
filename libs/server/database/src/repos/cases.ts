import { ColumnSet, IDatabase, IMain } from 'pg-promise';
import { DbCase, DbOperation } from '../models/types';
import { SelectRenamedColumns } from '../lib/select-renamed-columns';
import { GetCasesDto } from '../models/dto/get-cases';
import { useKeysetPagination } from '../lib/use-keyset-pagination';
import {
  StatusClassificator,
  useStatusClassificator,
} from '../lib/use-status-classificator';

const casesTable = { table: 'cases', schema: 'dev' };
const casesColumns = [
  { name: 'CaseID', prop: 'id', cnd: true },
  { name: 'EDO_Case_ID', prop: 'edoId', cnd: true },
  { name: 'Archived', prop: 'isArchived' },
  { name: 'EntryDate', prop: 'createdAt', cnd: true },
  { name: 'CaseNum', prop: 'caseNum' },
  { name: 'CaseDate', prop: 'caseDate' },
  { name: 'RezToBiktimirov', prop: 'zamResolutionId' },
  { name: 'ZamDueDate', prop: 'zamDueDate' },
  { name: 'ZamDoneDate', prop: 'zamDoneDate' },
  { name: 'RezToLukyanov', prop: 'uprResolutionId' },
  { name: 'UprBossID', prop: 'uprBossId' },
  { name: 'UprDueDate', prop: 'uprDueDate' },
  { name: 'RezToExpert', prop: 'expertResolutionId' },
  { name: 'ExpertID', prop: 'expertId' },
  { name: 'ExpertDueDate', prop: 'expertDueDate' },
  { name: 'RezToUser', prop: 'userResolutionId' },
  { name: 'UserID', prop: 'userId' },
  { name: 'UserDueDate', prop: 'userDueDate' },
  { name: 'Curator', prop: 'curator' },
  { name: 'Resolution', prop: 'resolutionText' },
  { name: 'ResumeText', prop: 'resumeText' },
  { name: 'CaseNotes', prop: 'notesText' },
  { name: 'SameCases', prop: 'hasIdenticalCases' },
  { name: 'Adress', prop: 'adress' },
  { name: 'FIO', prop: 'fio' },
  { name: 'RedControll', prop: 'isRedControll' },
  { name: 'CaseStatusTypeID', prop: 'statusId', cnd: true },
  { name: 'case_first_reply_date', prop: 'firstReplyDate' },
  { name: 'new_theme_id', prop: 'themeId' },
  { name: 'new_question_id', prop: 'questionId' },
  { name: 'new_problem_id', prop: 'problebId' },
  { name: 'new_is_client', prop: 'isClient' },
  { name: 'new_is_reaction', prop: 'isReaction' },
  { name: 'new_is_complaint', prop: 'isComplaint' },
  { name: 'priority' },
];

const operationsTable = { table: 'replies', schema: 'dev' };
const operationsColumns = [
  { name: 'ReplyID', prop: 'id', cnd: true },
  { name: 'EntryDate', prop: 'createdAt' },
  { name: 'ReplyNum', prop: 'num' },
  { name: 'ReplyNotes', prop: 'notes' },
  { name: 'CaseID', prop: 'caseId' },
  { name: 'SignatoryID', prop: 'signatoryId' },
  { name: 'CurrentSigID', prop: 'currentId' },
  { name: 'EDO_Case_ID', prop: 'edoId' },
  { name: 'CreationDate', prop: 'date' },
];

const edoClassidicator: StatusClassificator<string>[] = [
  { queryType: 'NOT_NULL', column: 'zamDoneDate', status: 'done' },
  { queryType: 'NULL', column: 'zamDueDate', status: 'recalled' },
  {
    queryType: 'HAS_OPERATION_TYPE',
    param: { field: 'num', comperator: 'LIKE', value: '%ДГИ-%' },
    status: 'await',
  },
  {
    queryType: 'HAS_OPERATION_TYPE',
    param: { field: 'num', comperator: 'LIKE', value: '%согл-%' },
    status: 'sogl',
  },
  { queryType: 'NULL', column: 'userId', status: 'assignment' },
];

export class CasesRepository {
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

  private casesCs: ColumnSet<DbCase>;
  private operationsCs: ColumnSet<DbOperation>;

  constructor(
    private db: IDatabase<any>,
    private pgp: IMain,
  ) {
    this.casesCs = new pgp.helpers.ColumnSet(casesColumns, {
      table: casesTable,
    });

    this.operationsCs = new pgp.helpers.ColumnSet(operationsColumns, {
      table: operationsTable,
    });
  }

  // returns operations (with keyset pagination option)
  many(getCasesDto: GetCasesDto = {}): Promise<DbCase[]> {
    const { limit = 100, lastPrio, lastDate, lastId } = getCasesDto;

    // принудительно сбрасываем дату, если мы уже дошли до 3-го приоритета. В нем заведомо нет дат... Просто подстраховка, бро.
    const dueDate =
      lastPrio === 3 || !lastDate
        ? undefined
        : lastDate.toISOString().slice(0, 10);

    const paginationFields = [
      { name: 'priority', value: lastPrio },
      { name: 'ZamDueDate', value: dueDate, minValue: '-infinity' },
      { name: 'CaseID', value: lastId },
    ];

    const [paginationSql, paginationObj] = useKeysetPagination(
      paginationFields,
      '>',
      'c',
    );

    const [statusSql, statusObj] = useStatusClassificator(
      edoClassidicator,
      'in_work',
    );

    const operationsAggSql =
      '(SELECT json_agg(o.*) FROM (' +
      SelectRenamedColumns(this.operationsCs) +
      ' WHERE c."CaseID" = "CaseID") o) as operations';

    const baseQuery =
      SelectRenamedColumns(this.casesCs, 'c', [operationsAggSql]) +
      ` WHERE c."Archived" = false ${paginationSql}`;

    const queryWithStatusClassificator = `SELECT 
      CASE ${statusSql} END AS status, * FROM
      (${baseQuery}) as base_q
      LIMIT ${limit}`;

    // console.log(queryWithStatusClassificator);
    // console.log({ ...paginationObj, ...statusObj });
    return this.db.any(queryWithStatusClassificator, {
      ...paginationObj,
      ...statusObj,
    });
  }
}
