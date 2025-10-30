WITH building_data AS (
	SELECT 
		id,
		CASE 
			WHEN b.terms->'actual'->>'firstResetlementStart' IS NOT NULL THEN COALESCE((b.terms->>'doneDate')::date,  NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date
			ELSE null
		END as age,
		COALESCE(b.manual_relocation_type, b.relocation_type) = 1 AND b.terms->>'partialStart' IS NULL OR b.terms->>'partialEnd' IS NOT NULL as ok,
		CASE
			WHEN (b.terms->'actual'->>'demolitionEnd')::date IS NOT NULL THEN 'Завершено'
			WHEN (b.terms->'actual'->>'secontResetlementEnd')::date IS NOT NULL THEN 'Снос'
			WHEN (b.terms->'actual'->>'firstResetlementEnd')::date IS NOT NULL THEN 'Отселение'
			WHEN (b.terms->'actual'->>'firstResetlementStart')::date IS NULL THEN 'Не начато'
			ELSE 'Переселение'
		END as relocation_status
	FROM renovation.buildings_old b
)
SELECT 
	b.relocation_age as "age",
	COUNT(*) FILTER (WHERE classificator->'problems' @> '"Нет ЗУ"')::integer as "noNotification",
	COUNT(*) FILTER (WHERE classificator->'problems' @> '"Неустраненные дефекты"')::integer as "activeDefects",
	COUNT(*) FILTER (WHERE classificator->'problems' @> '"Просрочен иск"')::integer as "overdueLitigation",
	COUNT(*) FILTER (WHERE classificator->'problems' @> '"Долгие суды"')::integer as "longLitigation"
FROM renovation.apartments_old_temp a
LEFT JOIN (SELECT id, 
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
	FROM building_data
	WHERE relocation_status = 'Переселение' AND ok = true
) b ON b.id = a.building_id
WHERE a.classificator->>'deviation' = ANY(ARRAY['Риск', 'Требует внимания']) AND b.relocation_age IS NOT NULL
GROUP BY b.relocation_age, b.age_priority
ORDER BY b.age_priority;