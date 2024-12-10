SELECT
	o.id,
	json_build_object('id', u.id, 'fio', u.fio) as author,
	o.created_at as "createdAt",
	o.payload->-1
			|| jsonb_build_object('type', to_jsonb(t))
			as payload
FROM control.operations o
LEFT JOIN (SELECT id, name, category, fullname, priority FROM control.operation_types) t ON t.id = (o.payload->-1->'type')::integer
LEFT JOIN renovation.users u ON u.id = o.author_id
WHERE class = ${operationClass}; AND case_id = ${id};