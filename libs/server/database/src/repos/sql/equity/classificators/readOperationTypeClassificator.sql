SELECT     
	'Типы операций' as value,
    'Типы операций' as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', name,
        'fullname', name,  
		'tags', ARRAY[]::text[],
		'category', 'operation_type'
	)) as items
FROM equity.operation_types;