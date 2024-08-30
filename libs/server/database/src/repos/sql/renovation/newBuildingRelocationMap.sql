WITH raw_data AS ( 

    SELECT  id, outline, adress,         
            null as path, 'selected' as type, 3 as prio
    FROM renovation.buildings_new WHERE id = ${id}

    UNION

    SELECT DISTINCT ON(c.old_building_id)
            c.old_building_id as id, old.outline, old.adress,         
            ST_ShortestLine(new.outline, old.outline) as path, 'movement' as type, 1 as prio
    FROM renovation.connection_building_movement c 
    LEFT JOIN renovation.buildings_new new ON c.new_building_id = new.id
    LEFT JOIN renovation.buildings_old old ON c.old_building_id = old.id 
    WHERE c.new_building_id = ${id}

    UNION

    SELECT DISTINCT ON(c.old_building_id)
        c.old_building_id as id, old.outline, old.adress, 
        null as path, 'construction' as type, 0 as prio
    FROM renovation.connection_building_construction c 
    LEFT JOIN renovation.buildings_old old ON c.old_building_id = old.id
    WHERE c.new_building_id = ${id} 
)
SELECT 
    id, 
    ST_AsGeoJSON(ST_FlipCoordinates(outline))::jsonb as geometry,    
    adress,
    ST_AsGeoJSON(ST_FlipCoordinates(path))::jsonb as path,    
    ST_AsGeoJSON(ST_FlipCoordinates(ST_LineInterpolatePoint(path, 1)))::jsonb as start,
    ST_AsGeoJSON(ST_FlipCoordinates(ST_LineInterpolatePoint(path, 0)))::jsonb as finish,    
    type,
    ST_AsGeoJSON(ST_FlipCoordinates(ST_Extent(outline) OVER()))::jsonb as bounds
FROM raw_data
ORDER BY prio ASC;