SELECT 
	c.id, 
	c.created_at as "createdAt", 
	c.author_id as "authorId",
	c.payload->-1 as payload,
	jsonb_build_object(
		'id', t.id,
		'name', t.name,
		'category', t.category,
		'fullName', t.fullname
	) as status
FROM control.cases c
LEFT JOIN control.case_status_types t ON t.id = 1; -- placeholder, duh