SELECT     
	s.department_id as value,
    d.display_name as label,    
	JSONB_AGG(jsonb_build_object(
		'value', s.id,        
		'label', s.short_name,
        'fullname', s.display_name,  
		'tags', ARRAY[d.short_name, d.boss_surname, s.display_name]::text[],
		'category', d.display_name
	)) as items
FROM vks.services s
LEFT JOIN vks.departments d on s.department_id = d.id
GROUP BY d.zam_id, s.department_id, d.display_name
ORDER BY d.zam_id, s.department_id, d.display_name;