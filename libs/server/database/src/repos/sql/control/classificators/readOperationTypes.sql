SELECT     
	category as value,
    category as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', name,
        'fullname', fullname,  
		'priority', priority,
		'autoApprove', auto_approve,
		'tags', jsonb_build_array(LOWER(fullname), LOWER(category)),
		'category', category 
	)) as items
FROM control.operation_types
-- WHERE category = ANY(ARRAY['рассмотрение', 'решение'])
GROUP BY category;