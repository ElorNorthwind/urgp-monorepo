SELECT     
	category as value,
    category as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', name,
        'fullname', fullname,  
		'tags', tags || lower(fullname) || lower(category)
	)) as items
FROM control.directions
GROUP BY category;