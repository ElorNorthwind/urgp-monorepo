SELECT     
	category as value,
    regexp_replace(category, '\d+\. ', '') as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', CASE WHEN name LIKE 'Запрошено заключение%' THEN 'Запрошено заключение' ELSE name END,
        'fullname', CASE WHEN fullname LIKE 'Запрошено заключение%' THEN 'Запрошено заключение' ELSE fullname END,  
		'tags', jsonb_build_array(LOWER(fullname), LOWER(category)),
		'fields', fields,
		'category', category
	) ORDER BY sort_order, id) as items
FROM equity.operation_types
WHERE is_important
GROUP BY category;