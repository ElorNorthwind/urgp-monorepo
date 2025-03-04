WITH queue AS (
	SELECT 
		s.id,
		(SUM(r.total - r.done) 
		OVER (PARTITION BY r.done < r.total 
		ORDER BY s.created_at ASC) - (r.total - r.done))::integer AS queue
	FROM address.sessions s
	LEFT JOIN (
		SELECT 
			session_id,
			COUNT(*)::integer as total, 
			COALESCE(COUNT(*) FILTER (WHERE is_done IS NOT DISTINCT FROM true), 0)::integer as done
		FROM address.results
		GROUP BY session_id
	) r ON s.id = r.session_id
	WHERE r.done < r.total
), results AS (
	SELECT 
		session_id,
		COUNT(*)::integer as total, 
		COALESCE(COUNT(*) FILTER (WHERE is_done IS NOT DISTINCT FROM true), 0)::integer as done,
		COALESCE(COUNT(*) FILTER (WHERE is_done IS NOT DISTINCT FROM true AND is_error IS DISTINCT FROM true), 0)::integer as success,
		COALESCE(COUNT(*) FILTER (WHERE is_error IS NOT DISTINCT FROM true), 0)::integer as error
	FROM address.results
	GROUP BY session_id
)

SELECT 
	s.id,
	s.user_id as "userId",
	s.created_at as "createdAt",
	s.updated_at as "updatedAt",
	s.updated_at - s.created_at as duration,
	-- s.is_error as "isError",
	-- s.is_done as "isDone",
	s.type,
	s.title,
	s.notes,
	CASE WHEN r.done = r.total THEN 'done' ELSE 'pending' END as status,
	r.total, 
	r.done,
	r.success,
	r.error,
	q.queue
FROM address.sessions s
LEFT JOIN results r ON s.id = r.session_id
LEFT JOIN queue q ON s.id = q.id
WHERE s.user_id = ${userId}
ORDER BY s.created_at DESC
LIMIT 100;