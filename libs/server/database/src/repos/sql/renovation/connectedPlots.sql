SELECT DISTINCT c.new_building_id as "newBuildingId", 
                JSONB_AGG(JSONB_BUILD_OBJECT('id', f.id, 'adress', f.adress, 'aparts', f.apartments->'deviationMFR')) as plots
FROM renovation.connection_building_construction c
LEFT JOIN renovation.old_buildings_full f ON f.id = c.old_building_id
WHERE new_building_id = ANY(
	SELECT new_building_id
	FROM renovation.connection_building_construction
	WHERE is_cancelled <> true AND old_building_id = ${id}
)
GROUP BY c.new_building_id;