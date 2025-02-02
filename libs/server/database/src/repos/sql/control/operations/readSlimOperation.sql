SELECT 
	o.id,
	o.case_id as "caseId",
	o.class,
	o.type_id as "typeId",
	o.author_id as "authorId",
	o.updated_by_id as "updatedById",
	o.control_from_id as "controlFromId",
	o.control_to_id as "controlToId",
	o.approve_from_id as "approveFromId",
	o.approve_to_id as "approveToId",
	o.approve_status as "approveStatus",
	o.approve_date as "approveDate",
	o.approve_notes as "approveNotes",
	o.created_at as "createdAt",
	o.updated_at as "updatedAt",
	o.due_date as "dueDate",
	o.done_date as "doneDate",
	o.title,
	o.notes,
	o.extra
FROM control.operations_ o
${conditions:raw};