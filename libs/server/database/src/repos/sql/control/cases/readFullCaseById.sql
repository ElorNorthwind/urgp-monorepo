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
	json_build_object('id', u.id, 'fio', u.fio) as author,
	c.created_at as "createdAt", 
	c.payload->-1 
		|| jsonb_build_object('directions', d.val)
		|| jsonb_build_object('type', to_jsonb(t))
		|| jsonb_build_object('problems', null)   
	as payload,
	jsonb_build_object(
		'id', s.id,
		'name', s.name,
		'category', s.category,
		'fullName', s.fullname
	) as status
FROM control.cases c
LEFT JOIN control.case_types t ON t.id = (c.payload->-1->'type')::integer
LEFT JOIN directions d ON d.id = c.id
LEFT JOIN renovation.users u ON u.id = c.author_id
LEFT JOIN control.case_status_types s ON s.id = 1
WHERE c.id = ${id};