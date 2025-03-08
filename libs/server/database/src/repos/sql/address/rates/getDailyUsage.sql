SELECT 
	LEAST(SUM(amount) FILTER (WHERE response_source = 'fias') / 1000, 100) as fias,
	LEAST(SUM(amount) FILTER (WHERE response_source = 'dadata') / 100, 100) as dadata
FROM address.rates
WHERE date_trunc('day', now()) = date_trunc('day', created_at);