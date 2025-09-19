WITH apartment_totals AS (
    SELECT 
        building_id,
        -- COUNT(*) as total,
        -- COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Работа завершена'::varchar) as done,
        -- COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'В работе у МФР'::varchar) as mfr,
        -- COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Без отклонений'::varchar) as none,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Риск'::varchar) as risk,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Требует внимания'::varchar) as attention
        FROM renovation.apartments_old_temp
    GROUP BY building_id
)
SELECT 
	a.id as "apartmentId", 
	a.building_id as "buildingId",
	b.okrug,
	b.district,
	b.adress,
	a.apart_num as "apartmentNum",
	a.apart_type as "apartmentType",
	a.room_count as "roomCount",
	a.fio,
	a.old_apart_status as status,
	a.kpu_num as kpu,
	a.new_aparts as "newApartments",
	a.classificator,
	COALESCE(messages_count, 0) as "messagesCount",
	CASE
        WHEN (b.terms->'actual'->>'firstResetlementStart')::date IS NULL THEN 'Не начато'
        WHEN COALESCE((b.terms->>'doneDate')::date, NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date < '1 month' THEN 'Менее месяца'
        WHEN COALESCE((b.terms->>'doneDate')::date, NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date < '2 month' THEN 'От 1 до 2 месяцев'
        WHEN COALESCE((b.terms->>'doneDate')::date, NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date < '5 month' THEN 'От 2 до 5 месяцев'
        WHEN COALESCE((b.terms->>'doneDate')::date, NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date < '8 month' THEN 'От 5 до 8 месяцев'
        ELSE 'Более 8 месяцев'
	END as "relocationAge",
	CASE
        WHEN (b.terms->'actual'->>'demolitionEnd')::date IS NOT NULL THEN 'Завершено'
        WHEN (b.terms->'actual'->>'secontResetlementEnd')::date IS NOT NULL THEN 'Снос'
        WHEN (b.terms->'actual'->>'firstResetlementEnd')::date IS NOT NULL THEN 'Отселение'
        WHEN (b.terms->'actual'->>'firstResetlementStart')::date IS NULL THEN 'Не начато'
        ELSE 'Переселение'
	END as "buildingRelocationStatus",
	COALESCE(b.manual_relocation_type, b.relocation_type) as "relocationTypeId",
    CASE
        WHEN (b.terms->>'doneDate')::date IS NOT NULL THEN 'Работа завершена'::text
        WHEN ((COALESCE(b.manual_relocation_type, b.relocation_type) = ANY(ARRAY[2,3]) OR b.terms->>'partialStart' IS NOT NULL) AND b.terms->>'partialEnd' IS NULL) OR b.moves_outside_district = true THEN 'Без отклонений'::text
        WHEN at.risk > 0 THEN 'Наступили риски'::text
        WHEN at.attention > 0 THEN 'Требует внимания'::text
        ELSE 'Без отклонений'::text
    END as "buildingDeviation"
FROM (SELECT 
        id, 
        building_id, 
        apart_num, 
	    apart_type,
	  	room_count,
	  	kpu_num,
        fio, 
        old_apart_status, 
        new_aparts, 
        stages_dates, 
        classificator, 
        ROW_NUMBER() OVER (PARTITION BY building_id ORDER BY building_id, CAST(substring(apart_num, '\d+') AS integer), fio) as apart_npp 
    FROM renovation.apartments_old_temp) a
    LEFT JOIN renovation.buildings_old b ON a.building_id = b.id
    LEFT JOIN (SELECT apartment_id, COUNT(*) as messages_count FROM renovation.messages WHERE (message_payload->-1->>'deleted')::boolean IS DISTINCT FROM true AND apartment_id IS NOT NULL GROUP BY apartment_id) m ON a.id = m.apartment_id
    LEFT JOIN apartment_totals at ON a.building_id = at.building_id
ORDER BY adress, apart_npp;