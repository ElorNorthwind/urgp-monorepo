WITH apartment_totals AS (
    SELECT 
        building_id,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Работа завершена'::varchar) as done,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'В работе у МФР'::varchar) as mfr,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Без отклонений'::varchar) as none,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Риск'::varchar) as risk,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Требует внимания'::varchar) as attention
        FROM renovation.apartments_old
    GROUP BY building_id
)
SELECT DISTINCT c.new_building_id as "newBuildingId", 
                JSONB_AGG(JSONB_BUILD_OBJECT('id', b.id, 'adress', b.adress, 'aparts', JSONB_BUILD_OBJECT(
                                'done', a.done,
                                'mft', a.mfr,
                                'none', a.none,
                                'attention', a.attention,
                                'risk', a.risk
                        )) 
				ORDER BY CASE WHEN b.id = ${id} THEN 0 ELSE 1 END, b.adress) as plots
FROM renovation.connection_building_construction c
LEFT JOIN apartment_totals a ON a.building_id = c.old_building_id
LEFT JOIN renovation.buildings_old b ON b.id = c.old_building_id
WHERE new_building_id = ANY(
	SELECT new_building_id
	FROM renovation.connection_building_construction
	WHERE is_cancelled <> true AND old_building_id = ${id}
)
GROUP BY c.new_building_id;