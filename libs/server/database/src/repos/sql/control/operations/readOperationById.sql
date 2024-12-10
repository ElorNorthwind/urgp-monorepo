SELECT
	o.id,
	o.class,
    o.author_id as "authorId",
	o.created_at as "createdAt",
	o.payload->-1 as payload
FROM control.operations o
WHERE case_id = ${id};