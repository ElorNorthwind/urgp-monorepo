
SELECT 
	s.id,
	s.user_id as "userId",
		u.fio as "userFio",
	s.created_at as "createdAt",
	s.updated_at as "updatedAt",
	s.updated_at - s.created_at as duration,
	-- s.is_error as "isError",
	-- s.is_done as "isDone",
	s.type,
	s.title,
	s.notes,
	'pending' as status,
	r.total, 
	r.done,
	r.good,
	r.questionable,
	r.pending,
	r.error,
	(SUM(r.total - r.done) 
	 OVER (PARTITION BY r.done < r.total 
	 ORDER BY s.created_at ASC) - (r.total - r.done))::integer AS queue
FROM address.sessions s
LEFT JOIN (
	SELECT 
		session_id,
		COUNT(*)::integer as total, 
		COALESCE(COUNT(*) FILTER (WHERE is_done IS NOT DISTINCT FROM true), 0)::integer as done,
		COALESCE(COUNT(*) FILTER (WHERE is_done IS NOT DISTINCT FROM true AND is_error IS DISTINCT FROM true AND confidence <> 'low'), 0)::integer as good,
		COALESCE(COUNT(*) FILTER (WHERE is_done IS NOT DISTINCT FROM true AND is_error IS DISTINCT FROM true AND confidence = 'low'), 0)::integer as questionable,
		COALESCE(COUNT(*) FILTER (WHERE is_done IS DISTINCT FROM true), 0)::integer as pending,
		COALESCE(COUNT(*) FILTER (WHERE is_done IS NOT DISTINCT FROM true AND is_error IS NOT DISTINCT FROM true), 0)::integer as error
	FROM address.results
	GROUP BY session_id
) r ON s.id = r.session_id
LEFT JOIN renovation.users u ON s.user_id = u.id
WHERE r.done < r.total
ORDER BY s.created_at ASC;