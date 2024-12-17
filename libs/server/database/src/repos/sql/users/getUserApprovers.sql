WITH cases AS (
	SELECT jsonb_agg(jsonb_build_object('value', a.id, 'label', CASE WHEN a.id = u.id THEN 'Утвердить лично' ELSE a.fio END)) as data
	FROM renovation.users a
	LEFT JOIN renovation.users u ON u.control_data->'approvers'->'cases' @> to_jsonb(a.id)
	WHERE u.id = ${id}
), problems AS (
	SELECT jsonb_agg(jsonb_build_object('value', a.id, 'label', CASE WHEN a.id = u.id THEN 'Утвердить лично' ELSE a.fio END)) as data
	FROM renovation.users a
	LEFT JOIN renovation.users u ON u.control_data->'approvers'->'problems' @> to_jsonb(a.id)
	WHERE u.id = ${id}
), operations AS (
	SELECT jsonb_agg(jsonb_build_object('value', a.id, 'label', CASE WHEN a.id = u.id THEN 'Утвердить лично' ELSE a.fio END)) as data
	FROM renovation.users a
	LEFT JOIN renovation.users u ON u.control_data->'approvers'->'operations' @> to_jsonb(a.id)
	WHERE u.id = ${id}
)
SELECT c.data as cases, p.data as problems, o.data as operations
FROM cases c, problems p, operations o;