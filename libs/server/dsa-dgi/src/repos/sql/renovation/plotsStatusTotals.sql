WITH plots AS (
	SELECT 
		c.new_building_id, 
		CASE
			WHEN BOOL_AND(o.terms->>'doneDate' IS NOT NULL) THEN 'Освобождено'
			WHEN BOOL_AND(o.terms->'actual'->>'firstResetlementStart' IS NULL) THEN 'Освобождение не начато'
			WHEN BOOL_OR(COALESCE(o.manual_relocation_type, o.relocation_type) <> 1) THEN 'Идет частичное освобождение'
			ELSE 'Идет полное освобождение'
		END as status
	FROM renovation.connection_building_construction c
	LEFT JOIN renovation.buildings_old o ON o.id = c.old_building_id
	GROUP BY c.new_building_id
)
SELECT 
	COUNT(*) FILTER (WHERE status = 'Освобождено')::integer as done,
	COUNT(*) FILTER (WHERE status = 'Идет частичное освобождение')::integer as partial,
	COUNT(*) FILTER (WHERE status = 'Идет полное освобождение')::integer as full,
	COUNT(*) FILTER (WHERE status = 'Освобождение не начато')::integer as none	
FROM plots;
