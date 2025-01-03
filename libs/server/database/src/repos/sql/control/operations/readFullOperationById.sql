SELECT
	o.id,
	o.class,
	o.case_id as "caseId",
	json_build_object('id', u.id, 'fio', u.fio) as author,
	o.created_at as "createdAt",
	o.payload->-1
			#- '{typeId, approverId, approveById, updatedById}'
			|| jsonb_build_object('type', to_jsonb(t))
			|| jsonb_build_object('approver', json_build_object('id', u2.id, 'fio', u2.fio))
			|| jsonb_build_object('approveBy', json_build_object('id', u3.id, 'fio', u3.fio))
			|| jsonb_build_object('updatedBy', json_build_object('id', u4.id, 'fio', u4.fio))
			as payload,
	jsonb_array_length(o.payload) as version
FROM control.operations o
LEFT JOIN (SELECT id, name, category, fullname, priority FROM control.operation_types) t ON t.id = (o.payload->-1->>'typeId')::integer
LEFT JOIN renovation.users u ON u.id = o.author_id
LEFT JOIN renovation.users u2 ON u2.id = (o.payload->-1->>'approverId')::integer
LEFT JOIN renovation.users u3 ON u3.id = (o.payload->-1->>'approveById')::integer
LEFT JOIN renovation.users u4 ON u4.id = (o.payload->-1->>'updatedById')::integer
WHERE o.id = ${id};