SELECT     
	'Статусы объектов' as value,
    'Статусы объектов' as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', CASE WHEN id = 6 THEN 'Неопознанное требование' ELSE name END,
        'fullname', name,  
		'tags', ARRAY[]::text[],
		'category', category
	)) as items
FROM (SELECT * FROM equity.object_status_types
-- WHERE id <> 6
ORDER BY priority) s;