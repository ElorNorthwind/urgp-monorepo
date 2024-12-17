SELECT
	o.id,
	o.class,
	o.case_id as "caseId",
	json_build_object('id', u.id, 'fio', u.fio) as author,
	json_build_object('id', u2.id, 'fio', u2.fio) as approver,
	o.created_at as "createdAt",
	o.payload->-1
			|| jsonb_build_object('type', to_jsonb(t))
			as payload
FROM control.operations o
LEFT JOIN (SELECT id, name, category, fullname, priority FROM control.operation_types) t ON t.id = (o.payload->-1->>'type')::integer
LEFT JOIN renovation.users u ON u.id = o.author_id
LEFT JOIN renovation.users u2 ON u2.id = COALESCE((o.payload->-1->>'approveBy')::integer, (o.payload->-1->>'approver')::integer)
WHERE o.id = ${id};