SELECT     
	category as value,
    category as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', name,
        'fullname', fullname,  
		'tags', tags || lower(fullname) || lower(category),
		'category', category,
		'defaultExecutorId', default_executor_id
	)) as items
FROM control.direction_types
GROUP BY category
ORDER BY category;