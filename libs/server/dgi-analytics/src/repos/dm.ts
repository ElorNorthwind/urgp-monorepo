import { Logger } from '@nestjs/common';
import { DmRecord, DmSuspence } from '@urgp/shared/entities';
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
  { name: 'planDueDate', cast: 'timestamp with time zone' },
];

const dmSuspenceColumngs = [
  { name: 'documentId', cast: 'integer' },
  { name: 'techStageId', cast: 'integer' },
  { name: 'stageName' },
  { name: 'startDate', cast: 'timestamp with time zone' },
  { name: 'dueDate', cast: 'timestamp with time zone' },
  { name: 'doneDate', cast: 'timestamp with time zone' },
  { name: 'termValue', cast: 'integer' },
  { name: 'termType' },
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
WITH import_values(resolution_id, resolution_text, control_date, done_date, document_id, reg_num, from_fio, reg_date, category_id, plan_due_date) AS (
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
INSERT INTO dm.resolutions(id, document_id, resolution_text, control_date, done_date, plan_due_date)
SELECT DISTINCT ON (v.resolution_id) v.resolution_id, v.document_id, v.resolution_text, v.control_date, v.done_date, v.plan_due_date
FROM import_values v
ON CONFLICT (id) DO UPDATE SET
	document_id = excluded.document_id,
	resolution_text = excluded.resolution_text,
	control_date = excluded.control_date,
	done_date = excluded.done_date,
  plan_due_date = excluded.plan_due_date`;
    // WHERE (dm.resolutions.document_id, dm.resolutions.resolution_text, dm.resolutions.control_date, dm.resolutions.done_date) <> (excluded.document_id, excluded.resolution_text, excluded.control_date, excluded.done_date);
    // `;
    return this.db.none(
      query,
      this.pgp.helpers.values(records, dmResultColumngs),
    );
  }

  insertDmSuspences(records: DmSuspence[]): Promise<null> {
    if (!records || records?.length === 0) return Promise.resolve(null);
    const query = `
WITH import_values(document_id, tech_stage_id, stage_name, start_date, due_date, done_date, term_value, term_type) AS (
	VALUES
	$1:raw
)
INSERT INTO dm.suspences(document_id, tech_stage_id, stage_name, start_date, due_date, done_date, term_value, term_type, updated_at)
SELECT DISTINCT ON (v.document_id, v.tech_stage_id) v.document_id, v.tech_stage_id, v.stage_name, v.start_date, v.due_date, v.done_date, v.term_value, v.term_type, NOW()
FROM import_values v
ON CONFLICT (document_id, tech_stage_id) DO UPDATE
SET start_date = excluded.start_date, 
	due_date = excluded.due_date, 
	done_date = excluded.done_date
WHERE (dm.suspences.start_date, dm.suspences.due_date, dm.suspences.done_date) <> (excluded.start_date, excluded.due_date, excluded.done_date);`;
    return this.db.none(
      query,
      this.pgp.helpers.values(records, dmSuspenceColumngs),
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
  getSpdUndoneDocuments(): Promise<number[]> {
    const query = `SELECT d.id
FROM dm.documents d
LEFT JOIN dm.categories c ON d.category_id = c.id
LEFT JOIN dm.resolutions r ON r.document_id = d.id
WHERE c.category_group = 'SPD' AND r.done_date IS NULL`;
    return this.db.manyOrNone(query)?.then((res) => res.map((r) => r.id));
  }

  updateSuspensionControlDates(): Promise<null> {
    const query = `WITH suspension_length AS (
	SELECT 
		document_id, 
		COALESCE(SUM(term) FILTER (WHERE term_type = 'РД'), 0)::int as workdays, 
		COALESCE(SUM(term) FILTER (WHERE term_type <> 'РД'), 0)::int as days
	FROM dm.suspences
	GROUP BY document_id
), suspended_data AS (
	SELECT r.document_id,
	CASE WHEN c.department_id = 27 AND (r.done_date IS NULL OR cal.next_workday < r.done_date) THEN
		GREATEST(cal.next_workday::timestamp with time zone, COALESCE(r.done_date, date_trunc('day', NOW()) + INTERVAL '1 day'))
	ELSE
		cal.next_workday::timestamp with time zone
	END as "due_date"
	FROM dm.resolutions r
	LEFT JOIN suspension_length s ON s.document_id = r.document_id
	LEFT JOIN dm.documents d ON r.document_id = d.id
	LEFT JOIN dm.categories c ON d.category_id = c.id
	LEFT JOIN dm.calendar cal ON cal.date = dm.add_business_days((COALESCE(r.control_date, r.plan_due_date) + make_interval(days => s.days))::date, s.workdays)
	WHERE c.category_group = 'SPD' AND (r.done_date IS NULL OR r.due_date_with_suspensions IS NULL)
)
UPDATE dm.resolutions r
SET due_date_with_suspensions = COALESCE(d.due_date, r.control_date, r.plan_due_date)
FROM suspended_data d
WHERE d.document_id = r.document_id;`;
    return this.db.none(query);
  }
}
