SELECT
	o.id,
	o.class,
	o.case_id as "caseId",
	json_build_object('id', u.id, 'fio', u.fio) as author,
	json_build_object('id', u2.id, 'fio', u2.fio) as approver,
	o.created_at as "createdAt",
	o.payload->-1
			|| jsonb_build_object('type', to_jsonb(t))
			as payload,
	jsonb_array_length(o.payload) as version
FROM control.operations o
LEFT JOIN (SELECT id, name, category, fullname, priority FROM control.operation_types) t ON t.id = (o.payload->-1->>'type')::integer
LEFT JOIN renovation.users u ON u.id = o.author_id
LEFT JOIN renovation.users u2 ON u2.id = COALESCE((o.payload->-1->>'approveBy')::integer, (o.payload->-1->>'approver')::integer)
WHERE case_id = ${id} 
AND (o.payload->-1->>'isDeleted')::boolean IS DISTINCT FROM true
AND (o.payload->-1->>'approveStatus' = 'approved' OR o.author_id = ${userId} OR (o.payload->-1->>'approver')::integer = ${userId})
${operationClassText:raw}
ORDER BY o.created_at DESC;