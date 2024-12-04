WITH directions AS (
	SELECT  
		c.id,
		jsonb_agg(to_jsonb(d)) as val
	FROM control.cases c
	LEFT JOIN control.directions d ON c.payload->-1->'directions' @> to_jsonb(d.id)
	GROUP BY c.id
)

SELECT  
	c.id,
	c.author_id as "authorId", 
	c.created_at as "createdAt", 
	c.payload->-1 
		#- '{directions}' || jsonb_build_object('directions', d.val)
		#- '{type}' || jsonb_build_object('type', to_jsonb(t))
		#- '{problems}' || jsonb_build_object('problems', null)   
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
LEFT JOIN control.case_status_types s ON s.id = 1; -- placeholder, duh