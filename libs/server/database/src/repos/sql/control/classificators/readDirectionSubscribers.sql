SELECT 
	u.id, 
	u.fio as name, 
	u.control_settings->>'department' as category
FROM renovation.users u
WHERE EXISTS
(
	SELECT *
	FROM jsonb_array_elements(u.control_settings->'directions') as d(direction)
	WHERE d.direction::integer = ANY(ARRAY[${directions:list}])
);