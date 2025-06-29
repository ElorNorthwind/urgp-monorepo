WITH object_totals AS (
	SELECT 
		building_id,
		COUNT(*) FILTER(WHERE object_type_id = 1) as apartments,
		COUNT(*) FILTER(WHERE object_type_id = 2) as parkings
	FROM equity.objects
	GROUP BY building_id
)
SELECT 
	to_jsonb(c) as complex,
	(COUNT(*) FILTER (WHERE o.apartments > 0))::integer as "buildingsDone",
	(COUNT(*) FILTER (WHERE o.apartments IS NULL OR o.apartments = 0))::integer as "buildingsProject",
	ARRAY_AGG(b.id) as "buildingIds",
	COALESCE(MAX(o.apartments), 0)::integer as "maxApartments",
	COALESCE(MAX(o.parkings), 0)::integer as "maxParkings"
FROM equity.buildings b
	LEFT JOIN (SELECT id, name, developer_short as developer FROM equity.complexes) c ON c.id = b.complex_id
	LEFT JOIN object_totals o ON o.building_id = b.id
GROUP BY to_jsonb(c);