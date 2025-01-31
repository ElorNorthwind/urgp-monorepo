-- CASES TABLE MIGRATION
INSERT INTO control.cases_ 
(
	id,
	class,
	type_id,
	author_id,
	updated_by_id,

	approve_from_id,
	approve_to_id,
	approve_status,
	approve_date,
	approve_notes,

	created_at,
	updated_at,
	external_cases,
	direction_ids,
	title,

	notes,
	extra,
	archive_date
)
SELECT 
	c.id,
	c.class,
	(c.payload->0->>'typeId')::integer,
	c.author_id,
	(c.payload->0->>'updatedById')::integer,

	(c.payload->0->>'approverId')::integer,
	(c.payload->0->>'approveById')::integer,
	c.payload->0->>'approveStatus',
	(c.payload->0->>'approveDate')::timestamp with time zone,
	c.payload->0->>'approveNotes',

	c.created_at,
	(c.payload->0->>'updatedAt')::timestamp with time zone,
	c.payload->0->'externalCases',
	COALESCE(dir.directionIds, array[]::integer[]),

	c.payload->0->>'fio',
	c.payload->0->>'description',
	c.payload->0->>'adress',
	null
FROM control.cases c
LEFT JOIN (SELECT id, array_agg(value) as directionIds
	FROM (
		SELECT a.id, jsonb_array_elements_text(a.payload->0->'directionIds')::integer as value
		FROM control.cases a
	) a
	GROUP BY a.id) dir  ON dir.id = c.id
WHERE (c.payload->0->>'isDeleted')::boolean IS DISTINCT FROM true;

DELETE FROM control.cases_
WHERE id IN (SELECT id FROM control.cases WHERE (payload->-1->>'isDeleted')::boolean = true);

UPDATE control.cases_ c_
SET	class = c.class,
	type_id = (c.payload->-1->>'typeId')::integer,
	author_id = c.author_id,
	updated_by_id = (c.payload->-1->>'updatedById')::integer,
	approve_from_id = (c.payload->-1->>'approverId')::integer,
	approve_to_id = (c.payload->-1->>'approveById')::integer,
	approve_status = c.payload->-1->>'approveStatus',
	approve_date = (c.payload->-1->>'approveDate')::timestamp with time zone,
	approve_notes = c.payload->-1->>'approveNotes',
	created_at = c.created_at,
	updated_at = (c.payload->-1->>'updatedAt')::timestamp with time zone,
	external_cases = c.payload->-1->'externalCases',
	direction_ids = COALESCE(dir.directionIds, array[]::integer[]),
	title = c.payload->-1->>'fio',
	notes = c.payload->-1->>'description',
	extra = c.payload->-1->>'adress'
FROM control.cases c
LEFT JOIN (SELECT id, array_agg(value) as directionIds
	FROM (
		SELECT a.id, jsonb_array_elements_text(a.payload->-1->'directionIds')::integer as value
		FROM control.cases a
	) a
	GROUP BY a.id) dir  ON dir.id = c.id
WHERE c_.id = c.id
AND (c.payload->-1->>'isDeleted')::boolean IS DISTINCT FROM true;




-- OPERATIONS TABLE MIGRATION
INSERT INTO control.operations_ 
(
	id,
	case_id,
	class,
	type_id,
	author_id,

	updated_by_id,

	approve_from_id,
	approve_to_id,
	approve_status,
	approve_date,
	approve_notes,

	created_at,
	updated_at,
	due_date,
	done_date,
	control_from_id,
	control_to_id,
	title,
	notes,
	extra,
	archive_date
)
SELECT 
	o.id,
	o.case_id,
	o.class,
	(o.payload->0->>'typeId')::integer,
	o.author_id,

	(o.payload->0->>'updatedById')::integer,

	(o.payload->0->>'approveById')::integer,
	(o.payload->0->>'approverId')::integer,
	o.payload->0->>'approveStatus',
	(o.payload->0->>'approveDate')::timestamp with time zone,
	o.payload->0->>'approveNotes',

	o.created_at,
	(o.payload->0->>'updatedAt')::timestamp with time zone,

	(o.payload->0->>'dueDate')::timestamp with time zone,
	(o.payload->0->>'doneDate')::timestamp with time zone,
	(o.payload->0->>'controllerId')::integer,
	(o.payload->0->>'executorId')::integer,

	o.payload->0->>'num',
	o.payload->0->>'description',
	o.payload->0->>'dateDescription',
	null
FROM control.operations o
LEFT JOIN control.cases_ c ON o.case_id = c.id
WHERE (o.payload->0->>'isDeleted')::boolean IS DISTINCT FROM true 
AND o.case_id IS NOT NULL 
AND o.id IS NOT NULL
AND c.id IS NOT NULL
AND (o.payload->0->>'approveById')::integer <> 0
AND (o.payload->0->>'approverId')::integer <> 0;

DELETE FROM control.operations_
WHERE id IN (SELECT id FROM control.operations WHERE (payload->-1->>'isDeleted')::boolean = true) AND case_id IS NOT NULL AND id IS NOT NULL;

UPDATE control.operations_ o_
SET	
	case_id = o.case_id,
	class = o.class,
	type_id = (o.payload->-1->>'typeId')::integer,
	author_id = o.author_id,

	updated_by_id = (o.payload->-1->>'updatedById')::integer,

	approve_from_id = (o.payload->-1->>'approverId')::integer,
	approve_to_id = (o.payload->-1->>'approveById')::integer,

	approve_status = o.payload->-1->>'approveStatus',
	approve_date = (o.payload->-1->>'approveDate')::timestamp with time zone,
	approve_notes = o.payload->-1->>'approveNotes',

	created_at = o.created_at,
	updated_at = (o.payload->-1->>'updatedAt')::timestamp with time zone,

	due_date = (o.payload->-1->>'dueDate')::timestamp with time zone,
	done_date = (o.payload->-1->>'doneDate')::timestamp with time zone,
	control_from_id = (o.payload->-1->>'controllerId')::integer,
	control_to_id = (o.payload->-1->>'executorId')::integer,

	title = o.payload->-1->>'num',
	notes = o.payload->-1->>'description',
	extra = o.payload->-1->>'dateDescription'

FROM control.operations o
WHERE o_.id = o.id
AND (o.payload->-1->>'isDeleted')::boolean IS DISTINCT FROM true
AND o.case_id IS NOT NULL AND o.id IS NOT NULL
AND (o.payload->-1->>'approveById')::integer <> 0
AND (o.payload->-1->>'approverId')::integer <> 0;