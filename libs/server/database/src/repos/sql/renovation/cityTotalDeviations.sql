WITH apartment_totals AS ( 
    SELECT  
        building_id, 
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Риск'::varchar) as risk, 
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Требует внимания'::varchar) as attention 
        FROM renovation.apartments_old_temp 
    GROUP BY building_id 
), building_ages AS ( 
    SELECT  
        CASE 
            WHEN (b.terms->>'doneDate')::date IS NOT NULL THEN 'Работа завершена'::text 
            WHEN ((COALESCE(b.manual_relocation_type, b.relocation_type) = ANY(ARRAY[2,3]) OR b.terms->>'partialStart' IS NOT NULL) AND b.terms->>'partialEnd' IS NULL) OR b.moves_outside_district = true THEN 'Без отклонений'::text 
            WHEN at.risk > 0 THEN 'Наступили риски'::text 
            WHEN at.attention > 0 THEN 'Требует внимания'::text 
            ELSE 'Без отклонений'::text 
        END AS building_deviation, 
        CASE 
            WHEN (b.terms->'actual'->>'demolitionEnd')::date IS NOT NULL THEN 'Завершено' 
            WHEN (b.terms->'actual'->>'secontResetlementEnd')::date IS NOT NULL THEN 'Снос' 
            WHEN (b.terms->'actual'->>'firstResetlementEnd')::date IS NOT NULL THEN 'Отселение' 
            WHEN (b.terms->'actual'->>'firstResetlementStart')::date IS NULL THEN 'Не начато' 
            ELSE 'Переселение' 
        END as relocation_status 
    FROM renovation.buildings_old b 
    LEFT JOIN apartment_totals at ON at.building_id = b.id 
) 
SELECT JSONB_OBJECT_AGG(key, count) as result 
FROM 
( 
    SELECT  
        CASE 
            WHEN building_deviation = 'Работа завершена' THEN 'done' 
            WHEN relocation_status = 'Не начато' THEN 'notStarted' 
            WHEN building_deviation = 'Требует внимания' THEN 'warning' 
            WHEN building_deviation = 'Наступили риски' THEN 'risk' 
            ELSE 'none' 
        END as key, 
    COUNT(*)::integer as count 
    FROM building_ages 
    GROUP BY   
        CASE 
            WHEN building_deviation = 'Работа завершена' THEN 'done' 
            WHEN relocation_status = 'Не начато' THEN 'notStarted' 
            WHEN building_deviation = 'Требует внимания' THEN 'warning' 
            WHEN building_deviation = 'Наступили риски' THEN 'risk' 
            ELSE 'none' 
        END 
) t;