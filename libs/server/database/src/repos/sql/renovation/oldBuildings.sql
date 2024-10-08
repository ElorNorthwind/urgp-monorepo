-- WITH ao_ordering(o_okrug, rank) AS (
-- 	VALUES
-- 	('ЦАО',1),
-- 	('САО',2),
-- 	('СВАО',3),
-- 	('ВАО',4),
-- 	('ЮВАО',5),
-- 	('ЮАО',6),
-- 	('ЮЗАО',7),
-- 	('ЗАО',8),
-- 	('СЗАО',9),
-- 	('ЗелАО',10),
-- 	('ТАО',11),
-- 	('НАО',12)
-- ), age_ordering(o_age, rank) AS (
-- 	VALUES
--     ('Не начато', 0),
--     ('Менее месяца', 1),
--     ('От 1 до 2 месяцев', 2),
--     ('От 2 до 5 месяцев', 3),
--     ('От 5 до 8 месяцев', 4),
--     ('Более 8 месяцев', 5),
--     ('Завершено', 6)
-- ), status_ordering(o_status, rank) AS ( 
-- 	VALUES 
--     ('Не начато', 0),
--     ('Переселение', 1),
--     ('Отселение', 2),
--     ('Снос', 3),
--     ('Завершено', 4)
-- )
-- SELECT  
-- 	id, 
-- 	okrug, 
-- 	district, 
-- 	adress, 
-- 	relocation_type_id as "relocationTypeId", 
-- 	relocation_type as "relocationType", 
-- 	total_apartments as "totalApartments", 
-- 	building_deviation as "buildingDeviation", 
-- 	relocation_age as "buildingRelocationStartAge", 
-- 	relocation_status as "buildingRelocationStatus", 
-- 	terms_reason as "termsReason", 
-- 	terms, 
-- 	new_building_constructions as "newBuildingConstructions", 
-- 	new_building_movements as "newBuildingMovements", 
-- 	jsonb_build_object('total', apartments->'total', 
-- 					   'deviation', apartments->'deviationMFR') as apartments,
-- 	problematic_aparts as "problematicAparts", 
-- 	COUNT(*) OVER() AS "totalCount" 
-- FROM renovation.old_buildings_full b
-- LEFT JOIN ao_ordering o ON o.o_okrug = b.okrug
-- LEFT JOIN age_ordering a ON a.o_age = b.relocation_age
-- LEFT JOIN status_ordering s ON s.o_status = b.relocation_status
-- ${conditions:raw} 
-- ORDER BY ${ordering:raw} 
-- LIMIT ${limit:raw} OFFSET ${offset:raw};

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
            WHEN COALESCE(b.manual_relocation_type, b.relocation_type) = ANY(ARRAY[2,3]) OR b.moves_outside_district = true THEN 'Без отклонений'::text
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
FROM building_info b
${conditions:raw};
