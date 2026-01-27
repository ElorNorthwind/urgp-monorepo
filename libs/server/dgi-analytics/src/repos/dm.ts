import { Logger } from '@nestjs/common';
import { DmRecord } from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';

const dmResultColumngs = [
  { name: 'resolutionId' },
  { name: 'resolutionText' },
  { name: 'controlDate', cast: 'timestamp with time zone' },
  { name: 'doneDate', cast: 'timestamp with time zone' },
  { name: 'documentId' },
  { name: 'registrationNumber' },
  { name: 'fromFio' },
  { name: 'registrationDate', cast: 'timestamp with time zone' },
  { name: 'categoryId' },
];

// @Injectable()
export class DmRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  insertDmData(records: DmRecord[]): Promise<null> {
    if (!records || records?.length === 0) return Promise.resolve(null);
    // console.log(records);

    const query = `
WITH import_values(resolution_id, resolution_text, control_date, done_date, document_id, reg_num, from_fio, reg_date, category_id) AS (
	VALUES
	$1:raw
), doc_insert AS (
	INSERT INTO dm.documents(id, category_id, reg_num, reg_date, from_fio)
	SELECT DISTINCT ON (v.document_id) v.document_id, v.category_id, v.reg_num, v.reg_date, v.from_fio
    FROM import_values v
	ON CONFLICT (id) DO UPDATE SET
		category_id = excluded.category_id,
		reg_num = excluded.reg_num,
		reg_date = excluded.reg_date,
		from_fio = excluded.from_fio
), deleted_resolutions AS (
    UPDATE dm.resolutions r
    SET deleted_at = NOW()
    FROM import_values v
    WHERE r.document_id = v.document_id 
      AND r.id <> v.resolution_id
)
INSERT INTO dm.resolutions(id, document_id, resolution_text, control_date, done_date)
SELECT v.resolution_id, v.document_id, v.resolution_text, v.control_date, v.done_date
FROM import_values v
ON CONFLICT (id) DO UPDATE SET
	document_id = excluded.document_id,
	resolution_text = excluded.resolution_text,
	control_date = excluded.control_date,
	done_date = excluded.done_date`;
    // WHERE (dm.resolutions.document_id, dm.resolutions.resolution_text, dm.resolutions.control_date, dm.resolutions.done_date) <> (excluded.document_id, excluded.resolution_text, excluded.control_date, excluded.done_date);
    // `;
    return this.db.none(
      query,
      this.pgp.helpers.values(records, dmResultColumngs),
    );
  }

  deleteMissingDocuments(
    records: DmRecord[],
    chunkIds: number[],
  ): Promise<null> {
    const dmDocIdColumn = [{ name: 'documentId' }];
    const query = `WITH found_ids(id) AS (
	VALUES
	$1:raw
  ), existing_ids(id) AS (
  VALUES
  $2:raw
  ), to_delete AS (
    SELECT e.id
    FROM existing_ids e
    LEFT JOIN found_ids f ON e.id = f.id
    WHERE f.id IS NULL
  )
  UPDATE dm.documents d
  SET deleted_at = NOW()
  FROM to_delete t
  WHERE d.id = t.id`;

    return this.db.none(query, [
      this.pgp.helpers.values(records, dmDocIdColumn),
      this.pgp.helpers.values(
        chunkIds.map((id) => ({ documentId: id })),
        dmDocIdColumn,
      ),
    ]);
  }

  getCategoryIds(group?: string): Promise<number[]> {
    const condition = group ? `WHERE category_group = '${group}'` : '';
    const query = `SELECT id FROM dm.categories ${condition};`;
    return this.db.manyOrNone(query)?.then((res) => res.map((r) => r.id));
  }

  getActiveResolutions(): Promise<number[]> {
    const query = `SELECT id FROM dm.resolutions WHERE control_date IS NOT NULL AND done_date IS NULL;`;
    return this.db.manyOrNone(query)?.then((res) => res.map((r) => r.id));
  }
  getAllResolutions(): Promise<number[]> {
    const query = `SELECT id FROM dm.resolutions WHERE control_date >= '01.01.2019'::date;`;
    return this.db.manyOrNone(query)?.then((res) => res.map((r) => r.id));
  }
  getAllDocuments(): Promise<number[]> {
    const query = `SELECT id FROM dm.documents;`;
    return this.db.manyOrNone(query)?.then((res) => res.map((r) => r.id));
  }
}
