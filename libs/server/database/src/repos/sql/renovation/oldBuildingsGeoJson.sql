SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(ST_AsGeoJSON(t.*)::json)
      ) as geojson
FROM
renovation.buildings_old AS t WHERE t.outline IS NOT NULL;