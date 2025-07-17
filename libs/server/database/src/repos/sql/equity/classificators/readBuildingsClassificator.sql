SELECT     
	b.complex_id as value,
    c.name as label,    
	JSONB_AGG(jsonb_build_object(
		'value', b.id,        
		'label', b.address_short,
        'fullname', b.address_full,  
		'tags', ARRAY[lower(c.developer)] || lower(c.name) || lower(b.address_full) || lower(b.address_construction),
		'category', CASE 
			WHEN c.developer LIKE '%Фонд%' AND b.is_done = true THEN 'fond_done'
			WHEN c.developer LIKE '%Фонд%' AND b.is_done = false THEN 'fond_construction'
			WHEN c.developer NOT LIKE '%Фонд%' AND b.is_done = true THEN 'ao_done'
			WHEN c.developer NOT LIKE '%Фонд%' AND b.is_done = false THEN 'ao_construction'
		END
	) ORDER BY b.id) as items
FROM equity.buildings b
LEFT JOIN equity.complexes c on b.complex_id = c.id
GROUP BY b.complex_id, c.name
ORDER BY b.complex_id;