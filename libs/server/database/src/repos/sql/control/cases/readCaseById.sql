SELECT 
	c.id, 
	c.created_at as "createdAt", 
	c.author_id as "authorId",
	c.payload->-1 as payload
FROM control.cases c
WHERE c.id = ${id};