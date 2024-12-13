SELECT     
	category as value,
    category as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', name,
        'fullname', fullname,
		'tags', jsonb_build_array(LOWER(fullname), LOWER(category))
	)) as items
FROM control.case_status_types
GROUP BY category;