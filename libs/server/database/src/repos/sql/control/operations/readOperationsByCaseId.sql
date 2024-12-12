SELECT
	o.id,
	o.class,
	json_build_object('id', u.id, 'fio', u.fio) as author,
	o.created_at as "createdAt",
	o.payload->-1
			|| jsonb_build_object('type', to_jsonb(t))
			as payload
FROM control.operations o
LEFT JOIN (SELECT id, name, category, fullname, priority FROM control.operation_types) t ON t.id = (o.payload->-1->'type')::integer
LEFT JOIN renovation.users u ON u.id = o.author_id
WHERE case_id = ${id} 
AND (o.payload->-1->>'deleted')::boolean IS DISTINCT FROM true
AND (o.payload->-1->>'approveStatus' = 'approved' OR o.author_id = ${userId} OR (o.payload->-1->'approver')::integer = ${userId})
${operationClassText:raw};