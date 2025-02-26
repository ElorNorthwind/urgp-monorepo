SELECT 
	global_id,
	p4, 
	p6, 
	p7, 
	p90, 
	p91, 
	simple_address
FROM public.address_registry
ORDER BY global_id
LIMIT ${limit} OFFSET ${offset};