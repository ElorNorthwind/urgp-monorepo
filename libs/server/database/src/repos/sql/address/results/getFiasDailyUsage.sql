SELECT 
	LEAST((COUNT(*) FILTER (WHERE is_done = true) * 2) / 1000, 100) as used
FROM address.results
WHERE date_trunc('day', now()) = date_trunc('day', updated_at) 
  AND response_source = 'fias-search';