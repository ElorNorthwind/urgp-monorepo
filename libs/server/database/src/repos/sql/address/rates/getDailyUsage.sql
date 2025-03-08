SELECT 
	LEAST(COUNT(*) FILTER (WHERE response_source = 'fias') / 1000, 100)  as fias
FROM address.rates
WHERE date_trunc('day', now()) = date_trunc('day', created_at);