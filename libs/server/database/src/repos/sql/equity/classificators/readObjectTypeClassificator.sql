SELECT     
	'Типы объектов' as value,
    'Типы объектов' as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', name,
        'fullname', name,  
		'tags', ARRAY[]::text[],
		'category', 'object_type'
	)) as items
FROM equity.object_types;