SELECT     
	'Статусы' as value,
    'Статусы' as label,    
	JSONB_AGG(jsonb_build_object(
		'value', s.status,        
		'label', s.status,
        'fullname', s.status,  
		'tags', ARRAY[]::text[],
		'category', 'статусы'
	) ORDER BY status) as items
FROM (SELECT DISTINCT status FROM vks.cases) s;