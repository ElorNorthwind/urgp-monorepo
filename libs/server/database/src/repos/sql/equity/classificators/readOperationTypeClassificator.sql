SELECT     
	'Типы операций' as value,
    'Типы операций' as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', name,
        'fullname', name,  
		'tags', fields,
		'category', 'operation_type'
	) ORDER BY priority, id) as items
FROM equity.operation_types;