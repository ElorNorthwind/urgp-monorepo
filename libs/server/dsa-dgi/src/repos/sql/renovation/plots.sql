WITH apartment_totals AS (
    SELECT 
        building_id,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Работа завершена'::varchar) as done,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'В работе у МФР'::varchar) as mfr,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Без отклонений'::varchar) as none,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Риск'::varchar) as risk,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Требует внимания'::varchar) as attention
        FROM renovation.apartments_old
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
), old_building_totals AS (
    SELECT 
        c.new_building_id, 
        MIN((o.terms->'plan'->>'firstResetlementStart')::date) as "planPlotStart",
        MAX((o.terms->'plan'->>'demolitionEnd')::date) as "planPlotDone",
        MIN((o.terms->'actual'->>'firstResetlementStart')::date) as "actualPlotStart",
        CASE 
            WHEN BOOL_AND(o.terms->>'doneDate' IS NOT NULL) THEN MAX( (o.terms->>'doneDate')::date ) 
            ELSE null 
        END as "actualPlotDone",
        BOOL_OR(o."relocationTypeId" <> 1) AS "hasPartial",
        BOOL_AND(o.terms->'actual'->>'firstResetlementStart' IS NOT NULL) as "fullStart",
        CASE 
            WHEN BOOL_AND(o.terms->>'doneDate' IS NOT NULL) THEN 'Работа завершена'::text
            WHEN BOOL_OR(o."relocationTypeId" <> 1) OR BOOL_OR(o.terms->> 'partialStart' IS NOT NULL) THEN 'Без отклонений'::text
            WHEN BOOL_OR((o.apartments->'deviation'->>'risk')::integer > 0) THEN 'Наступили риски'::text
            WHEN BOOL_OR((o.apartments->'deviation'->>'attention')::integer > 0) THEN 'Требует внимания'::text
            ELSE 'Без отклонений'::text
        END as "plotDeviation",
        COALESCE(MAX(o."buildingRelocationStartAge") FILTER (WHERE o."buildingRelocationStartAge" <> 'Не начато'), 'Не начато') as "buildingRelocationStartAge",
        COUNT(*)::integer as "buildingCount",
        json_agg(o) as "oldBuildings"
    FROM renovation.connection_building_construction c
    LEFT JOIN building_info o ON o.id = c.old_building_id
    GROUP BY c.new_building_id
)

SELECT 
    n.id as id,
    n.okrug,
    n.district,
    n.adress,
-- 	n.cad_num as "cadNum",
-- 	n.terms,
    CASE
        WHEN b."actualPlotStart" IS NULL THEN 'Не начато'
        WHEN COALESCE(b."actualPlotDone", NOW()) - b."actualPlotStart" < '1 month' THEN 'Менее месяца'
        WHEN COALESCE(b."actualPlotDone", NOW()) - b."actualPlotStart" < '2 month' THEN 'От 1 до 2 месяцев'
        WHEN COALESCE(b."actualPlotDone", NOW()) - b."actualPlotStart" < '5 month' THEN 'От 2 до 5 месяцев'
        WHEN COALESCE(b."actualPlotDone", NOW()) - b."actualPlotStart" < '8 month' THEN 'От 5 до 8 месяцев'
        ELSE 'Более 8 месяцев'
    END as "plotStartAge",
    CASE
        WHEN b."actualPlotDone" IS NOT NULL THEN 'Освобождено'
        WHEN b."actualPlotStart" IS NULL THEN 'Освобождение не начато'
        WHEN b."fullStart" THEN 'Идет полное освобождение'
        ELSE 'Идет частичное освобождение'
        -- WHEN b."hasPartial" THEN 'Идет частичное освобождение'
        -- ELSE 'Идет полное освобождение'
    END as "plotStatus",
    b."plotDeviation",
    b."buildingCount",

    b."planPlotStart",
    b."planPlotDone",
    b."actualPlotStart",
    b."actualPlotDone",
    b."oldBuildings"
    
FROM old_building_totals b
LEFT JOIN renovation.buildings_new n ON n.id = b.new_building_id;