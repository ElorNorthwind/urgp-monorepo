WITH RECURSIVE mapping AS (
	SELECT 
		id, 
		JSONB_BUILD_OBJECT('id', id, 
						   'fio', fio, 
						   'department', control_settings->>'department', 
						   'priority', (control_data->>'priority')::integer,
						   'executor', control_data->'roles' @> '"executor"') 
		as user_data,
		jsonb_array_elements(control_data->'approveTo')::integer as parent_id,
		fio
	FROM renovation.users 
	ORDER BY	(control_data->>'priority')::integer, 
				control_data->'roles' @> '"executor"', 
				fio
), levels AS (
	SELECT 
	id,
	parent_id,
	user_data,
	'{}'::jsonb as parent_user_data,
	array[]::integer[] as parents,
	JSONB_BUILD_ARRAY(user_data) as path,
	0 as node_level
	FROM Mapping
	WHERE parent_id = id

	UNION

	SELECT
	mapping.id, 
	mapping.parent_id,
	mapping.user_data,
	prev.user_data,
	mapping.parent_id || prev.parents,
	mapping.user_data || prev.path as path,
	prev.node_level + 1
	FROM levels as prev
	INNER JOIN mapping on mapping.parent_id = prev.id
	WHERE mapping.id <> mapping.parent_id
)

SELECT 
	ARRAY_TO_STRING(id || parents, '-') as key, 
	id,
	user_data->>'department' as department,
	path FROM levels
WHERE id = ${userId} OR (path->-1->>'id')::integer = ${userId}
ORDER BY 	user_data->>'department', 
			user_data->>'executor' DESC, 
			(user_data->>'priority')::integer DESC, 
			user_data->>'fio', 
			node_level, 
			array_length(parents, 1);