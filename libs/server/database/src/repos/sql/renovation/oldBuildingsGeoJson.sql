SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', jsonb_agg(ST_AsGeoJSON(t.*)::jsonb)
    ) as geojson
FROM (
	SELECT id, adress, outline as geom, 'old' as type
	FROM renovation.buildings_old
	WHERE outline IS NOT NULL
	
	UNION
	
	SELECT id, adress, outline as geom, 'new' as type
	FROM renovation.buildings_new
	WHERE outline IS NOT NULL	
     ) as t;