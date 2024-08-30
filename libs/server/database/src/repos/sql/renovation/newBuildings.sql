WITH new_dates_flat AS (
	SELECT building_id,
			json_build_object(
				'plan', json_build_object(
						'commissioning', min(control_date) FILTER (WHERE date_type = 3),
						'settlement', min(control_date) FILTER (WHERE date_type = 4)),
				'actual', json_build_object(
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
), full_data AS (
	SELECT
		b.id,
		b.okrug,
		b.district,
		b.adress,
		bt.terms
	FROM renovation.buildings_new b 
	LEFT JOIN new_dates_flat bt ON bt.building_id = b.id
)

SELECT * FROM full_data
WHERE id = ${id}