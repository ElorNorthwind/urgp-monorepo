-- WITH new_dates_flat AS (
-- 	SELECT building_id,
-- 			json_build_object(
-- 				'plan', json_build_object(
-- 						'commissioning', min(control_date) FILTER (WHERE date_type = 3),
-- 						'settlement', min(control_date) FILTER (WHERE date_type = 4)),
-- 				'actual', json_build_object(
-- 						'commissioning', min(control_date) FILTER (WHERE date_type = 1),
-- 						'settlement', min(control_date) FILTER (WHERE date_type = 2))
-- 			) as terms
-- 	FROM (SELECT 
-- 				building_id,
-- 				date_type,
-- 				control_date,
-- 				rank() OVER (PARTITION BY building_id, date_type ORDER BY updated_at DESC, id) AS rank
-- 			FROM renovation.dates_buildings_new	
-- 		) d WHERE d.rank = 1
-- 	GROUP BY building_id
-- ), full_data AS (
-- 	SELECT
-- 		b.id,
-- 		b.okrug,
-- 		b.district,
-- 		b.adress,
-- 		bt.terms
-- 	FROM renovation.buildings_new b 
-- 	LEFT JOIN new_dates_flat bt ON bt.building_id = b.id
-- )

-- SELECT * FROM full_data
-- WHERE id = ${id};


WITH new_dates_flat AS (
 SELECT building_id,
   jsonb_build_object(
    'plan', jsonb_build_object(
      'commissioning', min(control_date) FILTER (WHERE date_type = 3),
      'settlement', min(control_date) FILTER (WHERE date_type = 4)),
    'actual', jsonb_build_object(
      'commissioning', min(control_date) FILTER (WHERE date_type = 1),
      'settlement', min(control_date) FILTER (WHERE date_type = 2))
   ) as terms
 FROM (SELECT 
    building_id,
    date_type,
    control_date,
    rank() OVER (PARTITION BY building_id, date_type ORDER BY updated_at DESC, id) AS rank
   FROM renovation.dates_buildings_new 
  ) d WHERE d.rank = 1
 GROUP BY building_id
), old_building_dates AS (
 SELECT 
  building_id,
  -- плановые даты
  min(control_date) FILTER (WHERE date_type = 5) AS plan_first_resettlement_start,
  (min(control_date) FILTER (WHERE date_type = 5) + '1 year'::interval)::date AS plan_demolition_end,
  -- фактические даты
  min(control_date) FILTER (WHERE date_type = 1) AS actual_first_resettlement_start,
  min(control_date) FILTER (WHERE date_type = 4) AS actual_demolition_end
 FROM ( SELECT 
  building_id,
  date_type,
  control_date,
  rank() OVER (PARTITION BY building_id, date_type ORDER BY updated_at DESC, id) AS rank
 FROM renovation.dates_buildings_old
 ) d WHERE d.rank = 1
 GROUP BY building_id
), connections AS (
 SELECT 
 new_building_id,
 jsonb_agg(jsonb_build_object('adress', adress, 'terms', terms, 'id', old_building_id, 'type', type)) as connections
 FROM (
  SELECT 
   RANK() OVER (PARTITION BY c.old_building_id, c.new_building_id ORDER BY nct.priority DESC, c.updated_at DESC, c.id) as rank,
   c.old_building_id,
   c.new_building_id,
   'construction' as type, 
   b.adress,
   jsonb_build_object(
    'plan', jsonb_build_object(
      'start', d.plan_first_resettlement_start,
      'demolition', d.plan_demolition_end),
    'actual', jsonb_build_object(
      'start', d.actual_first_resettlement_start,
      'demolition', d.actual_demolition_end)
   ) as terms
  FROM renovation.connection_building_construction c
  LEFT JOIN renovation.buildings_new nc ON nc.id = c.new_building_id
  LEFT JOIN renovation.connection_building_construction_types nct ON nct.id = c.connection_type
  LEFT JOIN old_building_dates d ON d.building_id = c.old_building_id
  LEFT JOIN renovation.buildings_old b ON b.id = c.old_building_id
  WHERE c.is_cancelled = false

  UNION
  
  SELECT 
   RANK() OVER (PARTITION BY c.old_building_id, c.new_building_id ORDER BY nct.priority DESC, c.updated_at DESC, c.id) as rank,
   c.old_building_id,
   c.new_building_id,
   'movement' as type, 
   b.adress,
   jsonb_build_object(
    'plan', jsonb_build_object(
      'start', d.plan_first_resettlement_start,
      'demolition', d.plan_demolition_end),
    'actual', jsonb_build_object(
      'start', d.actual_first_resettlement_start,
      'demolition', d.actual_demolition_end)
   ) as terms
  FROM renovation.connection_building_movement c
  LEFT JOIN renovation.buildings_new nc ON nc.id = c.new_building_id
  LEFT JOIN renovation.connection_building_movement_types nct ON nct.id = c.connection_type
  LEFT JOIN old_building_dates d ON d.building_id = c.old_building_id
  LEFT JOIN renovation.buildings_old b ON b.id = c.old_building_id
  WHERE c.is_cancelled = false
 ) b WHERE b.rank = 1
 GROUP BY new_building_id
), full_data AS (
 SELECT
  b.id,
  b.okrug,
  b.district,
  b.adress,
  bt.terms,
  c.connections
 FROM renovation.buildings_new b 
 LEFT JOIN new_dates_flat bt ON bt.building_id = b.id
 LEFT JOIN connections c ON c.new_building_id = b.id
)

SELECT * 
FROM full_data 
WHERE id = ${id};