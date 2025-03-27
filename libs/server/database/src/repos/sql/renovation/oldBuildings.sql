WITH apartment_totals AS (
    SELECT 
        building_id,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Работа завершена'::varchar) as done,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'В работе у МФР'::varchar) as mfr,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Без отклонений'::varchar) as none,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Риск'::varchar) as risk,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Требует внимания'::varchar) as attention
        FROM renovation.apartments_old_temp
    GROUP BY building_id
), building_info AS (
    SELECT  
        b.id, 
        b.okrug, 
		b.okrug_order as "okrugOrder",
		b.status_order as "statusOrder",
        b.district, 
        b.adress, 
        COALESCE(b.manual_relocation_type, b.relocation_type) as "relocationTypeId",
        rt.type as "relocationType",
        CASE
            WHEN (b.terms->>'doneDate')::date IS NOT NULL THEN 'Работа завершена'::text
            WHEN ((COALESCE(b.manual_relocation_type, b.relocation_type) = ANY(ARRAY[2,3]) OR b.terms->>'partialStart' IS NOT NULL) AND b.terms->>'partialEnd' IS NULL) OR b.moves_outside_district = true THEN 'Без отклонений'::text
            WHEN at.risk > 0 THEN 'Наступили риски'::text
            WHEN at.attention > 0 THEN 'Требует внимания'::text
            ELSE 'Без отклонений'::text
        END AS "buildingDeviation",
        CASE
            WHEN (b.terms->'actual'->>'firstResetlementStart')::date IS NULL THEN 'Не начато'
            WHEN COALESCE((b.terms->>'doneDate')::date, NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date < '1 month' THEN 'Менее месяца'
            WHEN COALESCE((b.terms->>'doneDate')::date, NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date < '2 month' THEN 'От 1 до 2 месяцев'
            WHEN COALESCE((b.terms->>'doneDate')::date, NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date < '5 month' THEN 'От 2 до 5 месяцев'
            WHEN COALESCE((b.terms->>'doneDate')::date, NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date < '8 month' THEN 'От 5 до 8 месяцев'
            ELSE 'Более 8 месяцев'
        END as "buildingRelocationStartAge",
        CASE
            WHEN (b.terms->'actual'->>'demolitionEnd')::date IS NOT NULL THEN 'Завершено'
            WHEN (b.terms->'actual'->>'secontResetlementEnd')::date IS NOT NULL THEN 'Снос'
            WHEN (b.terms->'actual'->>'firstResetlementEnd')::date IS NOT NULL THEN 'Отселение'
            WHEN (b.terms->'actual'->>'firstResetlementStart')::date IS NULL THEN 'Не начато'
            ELSE 'Переселение'
        END as "buildingRelocationStatus",
        b.terms,
		-- COALESCE(at.total, 0)::integer as total,
        jsonb_build_object('total', COALESCE(at.total, 0)::integer, 
                        'deviation', json_build_object(
                                'done', COALESCE(at.done, 0)::integer,
                                'mfr', COALESCE(at.mfr, 0)::integer,
                                'none', COALESCE(at.none, 0)::integer,
                                'attention', COALESCE(at.attention, 0)::integer,
                                'risk', COALESCE(at.risk, 0)::integer
                        )) as apartments
    FROM renovation.buildings_old b
    LEFT JOIN apartment_totals at ON at.building_id = b.id
    LEFT JOIN renovation.relocation_types rt ON rt.id = COALESCE(b.manual_relocation_type, b.relocation_type)
)
SELECT  
	b.*
FROM building_info b;
