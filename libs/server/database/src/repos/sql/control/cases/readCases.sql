WITH directions AS (
	SELECT  
		c.id,
		jsonb_agg(to_jsonb(d)) as val
	FROM control.cases c
	LEFT JOIN control.direction_types d ON c.payload->-1->'directionIds' @> to_jsonb(d.id)
	GROUP BY c.id
)

SELECT  
	c.id,
	c.class,
	to_jsonb(u) as author,
	c.created_at as "createdAt", 
	GREATEST((c.payload->-1->>'updatedAt')::timestamp with time zone, o.updated) as "lastEdit",
	jsonb_build_object(
		'id', s.id,
		'name', s.name,
		'category', s.category,
		'fullName', s.fullname
	) as status,
	c.payload->-1 
		#- '{typeId, directionIds, problemIds, approverId, approveById, updatedById}'
		|| jsonb_build_object('directions', d.val)
		|| jsonb_build_object('type', to_jsonb(t))
		|| jsonb_build_object('problems', null)   
		|| jsonb_build_object('approver', to_jsonb(u2)) 
		|| jsonb_build_object('approveBy', to_jsonb(u3)) 
		|| jsonb_build_object('updatedBy', to_jsonb(u4)) 
	as payload
FROM control.cases c
LEFT JOIN control.case_types t ON t.id = (c.payload->-1->'typeId')::integer
LEFT JOIN directions d ON d.id = c.id
LEFT JOIN (SELECT id, fio FROM renovation.users) u ON u.id = c.author_id
LEFT JOIN (SELECT id, fio FROM renovation.users) u2 ON u2.id = (c.payload->-1->>'approverId')::integer
LEFT JOIN (SELECT id, fio FROM renovation.users) u3 ON u3.id = (c.payload->-1->>'approveById')::integer
LEFT JOIN (SELECT id, fio FROM renovation.users) u4 ON u4.id = (c.payload->-1->>'updatedById')::integer
LEFT JOIN control.case_status_types s ON s.id = 
	CASE 
		WHEN c.payload->-1->>'approveStatus' = 'pending' THEN 1 
		WHEN c.payload->-1->>'approveStatus' = 'rejected' THEN 5
		ELSE 2
	END
LEFT JOIN (SELECT case_id, COUNT(*) as count, MAX((payload->-1->>'updatedAt')::timestamp with time zone) as updated FROM control.operations GROUP BY case_id) o ON o.case_id = c.id
WHERE (c.payload->-1->>'isDeleted')::boolean IS DISTINCT FROM true
AND (c.payload->-1->>'approveStatus' = 'approved' OR c.author_id = ${userId} OR (c.payload->-1->>'approverId')::integer = ${userId} OR ${readAll} = true)
ORDER BY c.created_at ASC;