WITH building_ages AS ( 
    SELECT  
        CASE  
            WHEN terms->'actual'->>'firstResetlementStart' IS NOT NULL THEN COALESCE((terms->'actual'->>'firstResetlementEnd')::date, (terms->'actual'->>'secontResetlementEnd')::date,  (terms->'actual'->>'demolitionEnd')::date, NOW()) - (terms->'actual'->>'firstResetlementStart')::date 
            ELSE null 
        END as age, 
  DATE_PART('year', COALESCE((terms->'actual'->>'firstResetlementEnd')::date, (terms->'actual'->>'secontResetlementEnd')::date,  (terms->'actual'->>'demolitionEnd')::date, NOW())) as done_year, 
        building_deviation, 
        relocation_status, 
        adress 
    FROM renovation.old_buildings_full 
), prepared_data AS ( 
    SELECT  
        *, 
        CASE 
            WHEN age < '1 month' THEN 'Менее месяца' 
            WHEN age < '2 month' THEN 'От 1 до 2 месяцев' 
            WHEN age < '5 month' THEN 'От 2 до 5 месяцев' 
            WHEN age < '8 month' THEN 'От 5 до 8 месяцев' 
            ELSE 'Более 8 месяцев' 
        END as relocation_age, 
        CASE 
            WHEN age < '1 month' THEN 1 
            WHEN age < '2 month' THEN 2 
            WHEN age < '5 month' THEN 3 
            WHEN age < '8 month' THEN 4 
            ELSE 5 
        END as age_priority 
    FROM building_ages 
) 
SELECT  
 done_year::varchar as year, 
 COUNT(*) FILTER (WHERE relocation_age = 'Менее месяца')::integer as "0", 
 COUNT(*) FILTER (WHERE relocation_age = 'От 1 до 2 месяцев')::integer as "1", 
 COUNT(*) FILTER (WHERE relocation_age = 'От 2 до 5 месяцев')::integer as "2", 
 COUNT(*) FILTER (WHERE relocation_age = 'От 5 до 8 месяцев')::integer as "5", 
 COUNT(*) FILTER (WHERE relocation_age = 'Более 8 месяцев')::integer as "8" 
FROM prepared_data 
WHERE done_year > DATE_PART('year', NOW()) - 7 -- последние Х лет 
  AND building_deviation = 'Работа завершена' 
GROUP BY 
    done_year 
ORDER BY  
    done_year;