SELECT 
	s.id,
	s.user_id as "userId",
	s.created_at as "createdAt",
	s.updated_at as "updatedAt",
	s.updated_at - s.created_at as duration,
	s.is_error as "isError",
	s.is_done as "isDone",
	s.type,
	s.title,
	s.notes,
	COALESCE(r.total, 0)::integer as total, 
	COALESCE(r.done, 0)::integer as done,
	COALESCE(r.error, 0)::integer as error
FROM address.sessions s
LEFT JOIN (
	SELECT 
		session_id,
		COUNT(*) as total, 
		COUNT(*) FILTER (WHERE is_done IS NOT DISTINCT FROM true) as done,
		COUNT(*) FILTER (WHERE is_error IS NOT DISTINCT FROM true) as error
	FROM address.results
	GROUP BY session_id
) r ON s.id = r.session_id
WHERE s.user_id = ${userId}
ORDER BY s.created_at DESC;