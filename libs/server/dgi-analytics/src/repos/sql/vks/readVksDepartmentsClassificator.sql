SELECT     
	d.zam_id as value,
    z.short_name as label,    
	JSONB_AGG(jsonb_build_object(
		'value', d.id,        
		'label', d.display_name,
        'fullname', d.full_name,  
		'tags', ARRAY[z.short_name, d.boss_surname]::text[],
		'category', z.short_name
	) ORDER BY d.id) as items
FROM vks.departments d
LEFT JOIN vks.zams z on z.id = d.zam_id
GROUP BY d.zam_id, z.short_name
ORDER BY d.zam_id, z.short_name;