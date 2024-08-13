SELECT JSONB_OBJECT_AGG(key, count) as result
FROM
(
    SELECT 
        CASE
            WHEN relocation_status = 'Завершено' THEN 'done'
            WHEN relocation_status = 'Не начато' THEN 'notStarted'
            WHEN building_deviation = 'Требует внимания' THEN 'warning'
            WHEN building_deviation = 'Наступили риски' THEN 'risk'
            ELSE 'none'
        END as key,
    COUNT(*)::integer as count
    FROM renovation.old_buildings_full
    GROUP BY  
        CASE
            WHEN relocation_status = 'Завершено' THEN 'done'
            WHEN relocation_status = 'Не начато' THEN 'notStarted'
            WHEN building_deviation = 'Требует внимания' THEN 'warning'
            WHEN building_deviation = 'Наступили риски' THEN 'risk'
            ELSE 'none'
        END
) t;