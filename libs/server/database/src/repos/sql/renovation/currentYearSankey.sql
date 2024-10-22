WITH houses AS ( 
    SELECT
        (terms->'actual'->>'firstResetlementStart')::date as start_date,  
        (terms->>'doneDate')::date as end_date,
        DATE_PART('year', (terms->'actual'->>'firstResetlementStart')::date)::integer AS start_year,  
        DATE_PART('year', (terms->>'doneDate')::date)::integer AS end_year,
        AGE((terms->>'doneDate')::date, (terms->'actual'->>'firstResetlementStart')::date) AS age,
        relocation_type
    FROM renovation.buildings_old
    WHERE   
        ( (terms->'actual'->>'firstResetlementStart')::date IS NOT NULL AND (terms->>'doneDate')::date IS NULL )
        OR 
        ( DATE_PART('year', (terms->>'doneDate')::date) = DATE_PART('year', NOW()) )
), raw_data AS ( 
    SELECT 
        CASE   
            WHEN start_year >= DATE_PART('year', NOW()) THEN 2 -- 'В текущем году'
            WHEN start_year >= DATE_PART('year', NOW()) - 1 THEN 1 -- 'В прошлом году'   
            ELSE 0 -- 'Больше года тому назад'
        END as relocation_start_index,  
        CASE 
            WHEN age IS NULL THEN 3 -- остаются в работе
            WHEN age < '5 month' THEN 6 -- 'Быстрее 5 месяцев' 
            WHEN age < '8 month' THEN 5 -- 'От 5 до 8 месяцев'    
            ELSE 4 -- 'Более 8 месяцев'  
        END as relocation_age_index,  
        COUNT(*)::integer as count,
        COUNT(*) FILTER(WHERE relocation_type = 1)::integer as full_count
        FROM houses  
        GROUP BY
            CASE    
                WHEN start_year >= DATE_PART('year', NOW()) THEN 2 -- 'В текущем году'
                WHEN start_year >= DATE_PART('year', NOW()) - 1 THEN 1 -- 'В прошлом году'    
                ELSE 0 -- 'Больше года тому назад'
            END,
            CASE    
                WHEN age IS NULL THEN 3 -- остаются в работе
                WHEN age < '5 month' THEN 6 -- 'Быстрее 5 месяцев' 
                WHEN age < '8 month' THEN 5 -- 'От 5 до 8 месяцев'    
                ELSE 4 -- 'Более 8 месяцев'   
            END
)
SELECT 
    JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('name', 'Больше года тому назад'), -- 0 
        JSONB_BUILD_OBJECT('name', 'В прошлом году'), -- 1
        JSONB_BUILD_OBJECT('name', 'В текущем году'), -- 2 

        JSONB_BUILD_OBJECT('name', 'Еще не завершено'), -- 3
        JSONB_BUILD_OBJECT('name', 'Дольше 8 месяцев'), -- 4
        JSONB_BUILD_OBJECT('name', 'От 5 до 8 месяцев'), -- 6
        JSONB_BUILD_OBJECT('name', 'Быстрее 5 месяцев') -- 7
    ) as nodes, 
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
                'source', relocation_start_index,        
                'target', relocation_age_index, 
                'value', count,
                'valueFull', full_count)
            ) as links
FROM raw_data;