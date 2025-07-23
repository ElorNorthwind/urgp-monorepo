SELECT     
	category as value,
    regexp_replace(category, '\d+\. ', '') as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', name,
        'fullname', fullname,  
		'tags', jsonb_build_array(LOWER(fullname), LOWER(category)),
		'fields', fields,
		'category', category
	) ORDER BY sort_order, id) as items
FROM equity.operation_types
WHERE is_active = true
GROUP BY category;