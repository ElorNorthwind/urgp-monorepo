WITH building_ages AS (
    SELECT 
        CASE 
            WHEN terms->'actual'->>'firstResetlementStart' IS NOT NULL THEN COALESCE((terms->'actual'->>'firstResetlementEnd')::date, (terms->'actual'->>'secontResetlementEnd')::date,  (terms->'actual'->>'demolitionEnd')::date, NOW()) - (terms->'actual'->>'firstResetlementStart')::date
            ELSE null
        END as age,
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
    relocation_age as age,
    COUNT(*) FILTER (WHERE building_deviation = 'Работа завершена')::integer as done,
    COUNT(*) FILTER (WHERE building_deviation = 'Наступили риски' AND relocation_status = 'Переселение')::integer as risk,
    COUNT(*) FILTER (WHERE building_deviation = 'Требует внимания' AND relocation_status = 'Переселение')::integer as warning,
    COUNT(*) FILTER (WHERE building_deviation = 'Без отклонений' AND relocation_status = 'Переселение')::integer as none
FROM prepared_data
GROUP BY
    relocation_age,
    age_priority
ORDER BY 
    age_priority;