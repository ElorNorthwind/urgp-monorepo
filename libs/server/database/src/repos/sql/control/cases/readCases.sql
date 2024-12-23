WITH directions AS (
	SELECT  
		c.id,
		jsonb_agg(to_jsonb(d)) as val
	FROM control.cases c
	LEFT JOIN control.direction_types d ON c.payload->-1->'directions' @> to_jsonb(d.id)
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
		|| jsonb_build_object('directions', d.val)
		|| jsonb_build_object('type', to_jsonb(t))
		|| jsonb_build_object('problems', null)   
		|| jsonb_build_object('approver', to_jsonb(u2)) 
		|| jsonb_build_object('approveBy', to_jsonb(u3)) 
		|| jsonb_build_object('updatedBy', to_jsonb(u4)) 
	as payload
FROM control.cases c
LEFT JOIN control.case_types t ON t.id = (c.payload->-1->'type')::integer
LEFT JOIN directions d ON d.id = c.id
LEFT JOIN (SELECT id, fio FROM renovation.users) u ON u.id = c.author_id
LEFT JOIN (SELECT id, fio FROM renovation.users) u2 ON u2.id = (c.payload->-1->>'approver')::integer
LEFT JOIN (SELECT id, fio FROM renovation.users) u3 ON u3.id = (c.payload->-1->>'approveBy')::integer
LEFT JOIN (SELECT id, fio FROM renovation.users) u4 ON u4.id = (c.payload->-1->>'updatedBy')::integer
LEFT JOIN control.case_status_types s ON s.id = 1
LEFT JOIN (SELECT case_id, MAX((payload->-1->>'updatedAt')::timestamp with time zone) as updated FROM control.operations GROUP BY case_id) o ON o.case_id = c.id
WHERE (c.payload->-1->>'isDeleted')::boolean IS DISTINCT FROM true
ORDER BY c.created_at ASC;