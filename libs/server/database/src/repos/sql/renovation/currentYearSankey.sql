WITH houses AS ( 
    SELECT
        (terms->'actual'->>'firstResetlementStart')::date as start_date,  
        (terms->>'doneDate')::date as end_date,
        DATE_PART('year', (terms->'actual'->>'firstResetlementStart')::date)::integer AS start_year,  
        DATE_PART('year', (terms->>'doneDate')::date)::integer AS end_year,
        AGE((terms->>'doneDate')::date, (terms->'actual'->>'firstResetlementStart')::date) AS age 
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
            WHEN age < '3 month' THEN 6 -- 'До 3 месяцев'    
            WHEN age < '8 month' THEN 5 -- 'От 3 до 8 месяцев' 
            WHEN age < '1 year' THEN 4 -- 'От 8 до 12 месяцев'    
            ELSE 3 -- 'Более года' 
        END as relocation_age_index,  
        COUNT(*)::integer as count
        FROM houses  
        GROUP BY
            CASE    
                WHEN start_year >= DATE_PART('year', NOW()) THEN 2 -- 'В текущем году'
                WHEN start_year >= DATE_PART('year', NOW()) - 1 THEN 1 -- 'В прошлом году'    
                ELSE 0 -- 'Больше года тому назад'
            END,
            CASE    
                WHEN age < '3 month' THEN 6 -- 'До 3 месяцев' 
                WHEN age < '8 month' THEN 5 -- 'От 3 до 8 месяцев'    
                WHEN age < '1 year' THEN 4 -- 'От 8 до 12 месяцев' 
                ELSE 3 -- 'Более года'   
            END
)
SELECT 
    JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('name', 'Больше года тому назад'), -- 0 
        JSONB_BUILD_OBJECT('name', 'В прошлом году'), -- 1
        JSONB_BUILD_OBJECT('name', 'В текущем году'), -- 2 


        JSONB_BUILD_OBJECT('name', 'Дольше года'), -- 3 
        JSONB_BUILD_OBJECT('name', 'От 8 до 12 месяцев'), -- 4
        JSONB_BUILD_OBJECT('name', 'От 5 до 8 месяцев'), -- 5 
        JSONB_BUILD_OBJECT('name', 'До 3 месяцев') -- 6
    ) as nodes, 
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
                'source', relocation_start_index,        
                'target', relocation_age_index, 
                'value', count)
            ) as links
FROM raw_data;