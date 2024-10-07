WITH constructions AS (
	SELECT 
	old_building_id,
	jsonb_agg(construction) as construction
	FROM (
		SELECT 
			c.old_building_id,
			RANK() OVER (PARTITION BY c.old_building_id, c.new_building_id ORDER BY nct.priority DESC, c.updated_at DESC, c.id) as rank,
			jsonb_build_object('id', c.new_building_id, 
							   'adress', nc.adress,
							   'okrug', nc.okrug,
							   'district', nc.district,
							   'terms', nc.terms,
							   'type', nct.type,
							   'priority', nct.priority
							   ) as construction,
			   nc.adress || ' [' || nct.type || ']' AS construction_adress
		FROM renovation.connection_building_construction c
		LEFT JOIN renovation.buildings_new nc ON nc.id = c.new_building_id
		LEFT JOIN renovation.connection_building_construction_types nct ON nct.id = c.connection_type
		WHERE c.is_cancelled = false
	) b WHERE b.rank = 1
	GROUP BY old_building_id
), movements AS (
	SELECT 
	old_building_id,
	jsonb_agg(movement) as movement
	FROM (
		SELECT 
			m.old_building_id,
			RANK() OVER (PARTITION BY m.old_building_id, m.new_building_id ORDER BY nmt.priority DESC, m.updated_at DESC, m.id) as rank,
			jsonb_build_object('id', m.new_building_id, 
							   'adress', nm.adress,
							   'okrug', nm.okrug,
							   'district', nm.district,
							   'terms', nm.terms,
							   'type', nmt.type,
							   'priority', nmt.priority
							   ) as movement,
			   nm.adress || ' [' || nmt.type || ']' AS movement_adress
		FROM renovation.connection_building_movement m
		LEFT JOIN renovation.buildings_new nm ON nm.id = m.new_building_id
		LEFT JOIN renovation.connection_building_movement_types nmt ON nmt.id = m.connection_type
		WHERE m.is_cancelled = false
	) b WHERE b.rank = 1
	GROUP BY old_building_id
)
SELECT 
    b.id,
    c.construction as "newBuildingConstructions",
	m.movement as "newBuildingMovements"
FROM renovation.buildings_old b
LEFT JOIN constructions c ON c.old_building_id = b.id
LEFT JOIN movements m ON m.old_building_id = b.id
WHERE b.id = ${id};