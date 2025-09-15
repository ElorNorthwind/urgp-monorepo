SELECT     
  COALESCE(s.group_name, '') as value,
  COALESCE(s.group_name, '') as label,    
	JSONB_AGG(jsonb_build_object(
		'value', s.id,        
		'label', s.name,
    	'fullname', COALESCE(s.next_action_text, ''),  
		'tags', ARRAY_REMOVE(ARRAY[s.name, s.next_action_text, s.done_status_text]::text[], null),
		'category', COALESCE(s.group_name, ''),
		'count', COALESCE(c.count, 0) 
	)  ORDER BY s.priority, s.name) as items
FROM renovation.apartment_stages s
LEFT JOIN (
	SELECT (classificator->>'stageId')::integer as id, COUNT(*)::integer as count
	FROM renovation.apartments_old_temp
	GROUP BY (classificator->>'stageId')::integer) c ON c.id = s.id
WHERE c.count > 0
GROUP BY s.group_name
ORDER BY s.group_name;