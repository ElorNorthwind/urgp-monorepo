SELECT
 	u.category as value,
 	u.category as label,
 	jsonb_agg(u) as items
 FROM (
 	SELECT
 		id as value,
 		fio as label,
 		fio as fullname,
 		ARRAY[control_settings->>'department', fio] as tags,
 		control_settings->>'department' as category
 	FROM vks.users
 	WHERE control_data->'roles' ? 'vks'
 ) u
 GROUP BY u.category;