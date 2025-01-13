SELECT      
	'Управления' as value,
	'Управления' as label,     
	JSONB_AGG(jsonb_build_object(
		'value', category,         
		'label', category || ' (' || fio || ')',
		'fullname', category || ' (' || fio || ')', 
		'tags', jsonb_build_array(LOWER(category), LOWER(fio)),
		'category', 'Управления' 
	)) as items
FROM ( 
	SELECT DISTINCT 
		d.category, 
		u.fio
	FROM control.direction_types d 
	LEFT JOIN renovation.users u ON u.id = d.default_executor_id
) dir;