SELECT 
	LEAST(COALESCE(SUM(amount) FILTER (WHERE response_source = 'fias'), 0) / 1000, 100) as fias,
	LEAST(COALESCE(SUM(amount) FILTER (WHERE response_source = 'dadata'), 0) / 100, 100) as dadata,
	COALESCE(SUM(amount) FILTER (WHERE response_source = 'fias'), 0) as "fiasCount",
	COALESCE(SUM(amount) FILTER (WHERE response_source = 'dadata'), 0)  as "dadataCount"
FROM address.rates
WHERE date_trunc('day', now()) = date_trunc('day', created_at);