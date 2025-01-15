SELECT
	o.id,
	o.class,
	o.case_id as "caseId",
	json_build_object('id', u.id, 'fio', u.fio) as author,
	o.created_at as "createdAt",
	o.payload->-1
			#- '{typeId, approverId, approveById, updatedById, controllerId, executorId, observerId}'
			|| jsonb_build_object('type', to_jsonb(t))
			|| jsonb_build_object('approver', json_build_object('id', u2.id, 'fio', u2.fio))
			|| jsonb_build_object('approveBy', json_build_object('id', u3.id, 'fio', u3.fio))
			|| jsonb_build_object('updatedBy', json_build_object('id', u4.id, 'fio', u4.fio))
			|| jsonb_build_object('controller', json_build_object('id', u5.id, 'fio', u5.fio))
			|| jsonb_build_object('executor', json_build_object('id', u6.id, 'fio', u6.fio))
			|| jsonb_build_object('observer', json_build_object('id', u7.id, 'fio', u7.fio))
			|| jsonb_build_object('dueDateChanged', (o.payload->-1->>'dueDate')::date <> (o.payload->1->>'dueDate')::date)
			as payload,
	jsonb_array_length(o.payload) as version
FROM control.operations o
LEFT JOIN (SELECT id, name, category, fullname, priority FROM control.operation_types) t ON t.id = (o.payload->-1->>'typeId')::integer
LEFT JOIN renovation.users u ON u.id = o.author_id
LEFT JOIN renovation.users u2 ON u2.id = (o.payload->-1->>'approverId')::integer
LEFT JOIN renovation.users u3 ON u3.id = (o.payload->-1->>'approveById')::integer
LEFT JOIN renovation.users u4 ON u4.id = (o.payload->-1->>'updatedById')::integer
LEFT JOIN renovation.users u5 ON u5.id = (o.payload->-1->>'controllerId')::integer
LEFT JOIN renovation.users u6 ON u6.id = (o.payload->-1->>'executorId')::integer
LEFT JOIN renovation.users u7 ON u7.id = (o.payload->-1->>'observerId')::integer
WHERE case_id = ${id} 
AND (o.payload->-1->>'isDeleted')::boolean IS DISTINCT FROM true
AND (o.payload->-1->>'approveStatus' = ANY(ARRAY['approved', 'pending']) 
     OR o.author_id = ${userId} 
	 OR (o.payload->-1->>'approveById')::integer = ${userId}
	 OR (o.payload->-1->>'approverId')::integer = ${userId}) 
${operationClassText:raw}
ORDER BY (u5.control_data->>'priority')::integer DESC, (o.payload->-1->>'doneDate')::date DESC NULLS FIRST, o.created_at DESC;