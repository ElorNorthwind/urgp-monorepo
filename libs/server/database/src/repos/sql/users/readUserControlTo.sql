SELECT     
	'executors' as value,
    'Начальники управлений' as label,    
	COALESCE(JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', fio,
        'fullname', 'начальник ' || COALESCE(control_settings->>'department', ''),
		'tags', jsonb_build_array('начальник', LOWER(COALESCE(control_settings->>'department', ''))),
		'category', 'executors'
	)), '[]'::jsonb) as items
FROM renovation.users
WHERE control_data->'roles' ? 'executor'

UNION

SELECT     
	'controlTo' as value,
    'Мои сотрудники' as label,    
	COALESCE(JSONB_AGG(jsonb_build_object(
		'value', u1.id,        
		'label', u2.fio,
        'fullname', 'сотрудник ' || COALESCE(u2.control_settings->>'department', ''),
		'tags', jsonb_build_array('подчиненный', LOWER(COALESCE(u2.control_settings->>'department', ''))),
		'category', 'controlTo'
	)), '[]'::jsonb) as items
FROM (SELECT jsonb_array_elements(control_data->'controlTo')::integer as id FROM renovation.users WHERE id = ${userId}) u1
LEFT JOIN renovation.users u2 ON u1.id = u2.id;