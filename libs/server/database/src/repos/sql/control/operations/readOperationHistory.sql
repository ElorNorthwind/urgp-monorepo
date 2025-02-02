WITH 
	operation_types AS (SELECT id, name, category, fullname, priority FROM control.operation_types), 
	user_info AS (SELECT id, fio, (control_data->>'priority')::integer as priority FROM renovation.users)

SELECT 
	null as "revisionId",
	o.id as "id",
	o."caseId",
	o.class,
	o.type,
	o.author,
	o."updatedBy",
	o."controlFrom",
	o."controlTo",
	o."approveFrom",
	o."approveTo",
	o."approveStatus",
	o."approveDate",
	o."approveNotes",
	o."createdAt",
	o."updatedAt",
	o."dueDate",
	o."doneDate",
	o.title,
	o.notes,
	o.extra,
    null as "archiveDate",
	null as "deleteDate"
FROM control.full_operations o
WHERE id = ${id}

UNION ALL

SELECT
	o.id as "revisionId",
	o.operation_id as "id",
	o.case_id as "caseId",
	o.class,
	to_jsonb(t) as type,
	to_jsonb(u) as "author",
	to_jsonb(u2) as "updatedBy",
	to_jsonb(u3) as "controlFrom",
	to_jsonb(u4) as "controlTo",
	to_jsonb(u5) as "approveFrom",
	to_jsonb(u6) as "approveTo",
	o.approve_status as "approveStatus",
	o.approve_date as "approveDate",
	o.approve_notes as "approveNotes",
	o.created_at as "createdAt",
	o.updated_at as "updatedAt",
	o.due_date as "dueDate",
	o.done_date as "doneDate",
	o.title,
	o.notes,
	o.extra,
	o.archive_date as "archiveDate",
	o.delete_date as "deleteDate"
FROM control.operations_history o
LEFT JOIN operation_types t ON t.id = o.type_id
LEFT JOIN user_info u ON u.id = o.author_id
LEFT JOIN user_info u2 ON u2.id = o.updated_by_id
LEFT JOIN user_info u3 ON u3.id = o.control_from_id
LEFT JOIN user_info u4 ON u4.id = o.control_to_id
LEFT JOIN user_info u5 ON u5.id = o.approve_from_id
LEFT JOIN user_info u6 ON u6.id = o.approve_to_id
WHERE o.operation_id = ${id};