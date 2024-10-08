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
            WHEN b.terms->'actual'->>'firstResetlementStart' IS NOT NULL THEN COALESCE((b.terms->>'doneDate')::date,  NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date
            ELSE null
        END as age,
        CASE
            WHEN (b.terms->>'doneDate')::date IS NOT NULL THEN 'Работа завершена'::text
            WHEN COALESCE(b.manual_relocation_type, b.relocation_type) = ANY(ARRAY[2,3]) OR b.moves_outside_district = true THEN 'Без отклонений'::text
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
        END as relocation_status,
        COALESCE(b.manual_relocation_type, b.relocation_type) as relocation_type_id,
        b.adress
    FROM renovation.buildings_old b
    LEFT JOIN apartment_totals at ON at.building_id = b.id
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
--     COUNT(*) FILTER (WHERE building_deviation = 'Работа завершена')::integer as done,
    COUNT(*) FILTER (WHERE building_deviation = 'Наступили риски' AND relocation_status = 'Переселение')::integer as risk,
    COUNT(*) FILTER (WHERE building_deviation = 'Требует внимания' AND relocation_status = 'Переселение')::integer as warning,
    COUNT(*) FILTER (WHERE building_deviation = 'Без отклонений' AND relocation_status = 'Переселение')::integer as none,
    COUNT(*) FILTER (WHERE building_deviation = 'Без отклонений' AND relocation_status = 'Переселение' AND relocation_type_id = 1)::integer as full
FROM prepared_data
GROUP BY
    relocation_age,
    age_priority
ORDER BY 
    age_priority;