
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
		COALESCE(b.manual_relocation_type, b.relocation_type) as "relocationTypeId",
		b.terms,
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
), old_building_totals AS (
    SELECT 
        c.new_building_id, 
        MIN((o.terms->'actual'->>'firstResetlementStart')::date) as "actualPlotStart",
        CASE 
            WHEN BOOL_AND(o.terms->>'doneDate' IS NOT NULL) THEN MAX( (o.terms->>'doneDate')::date ) 
            ELSE null 
        END as "actualPlotDone",
--         BOOL_OR(o."relocationTypeId" <> 1) AS "hasPartial",
        BOOL_AND(o.terms->'actual'->>'firstResetlementStart' IS NOT NULL) as "fullStart",
        CASE 
            WHEN BOOL_AND(o.terms->>'doneDate' IS NOT NULL) THEN 'Работа завершена'::text
            WHEN BOOL_OR(o."relocationTypeId" <> 1) OR BOOL_OR(o.terms->> 'partialStart' IS NOT NULL) THEN 'Без отклонений'::text
            WHEN BOOL_OR((o.apartments->'deviation'->>'risk')::integer > 0) THEN 'Наступили риски'::text
            WHEN BOOL_OR((o.apartments->'deviation'->>'attention')::integer > 0) THEN 'Требует внимания'::text
            ELSE 'Без отклонений'::text
        END as "plotDeviation"
    FROM renovation.connection_building_construction c
    LEFT JOIN building_info o ON o.id = c.old_building_id
    GROUP BY c.new_building_id
), plots AS (
SELECT 
	b.new_building_id as id,
	CASE
		WHEN b."actualPlotDone" IS NOT NULL THEN 'Освобождено'
		WHEN b."actualPlotStart" IS NULL THEN 'Освобождение не начато'
		WHEN b."fullStart" THEN 'Идет полное освобождение'
		ELSE 'Идет частичное освобождение'
		-- WHEN b."hasPartial" THEN 'Идет частичное освобождение'
		-- ELSE 'Идет полное освобождение'
	END as status,
	b."plotDeviation" as deviation
FROM old_building_totals b
)
SELECT
	COUNT(*) FILTER (WHERE status = 'Освобождено')::integer as done,
	COUNT(*) FILTER (WHERE status = 'Идет частичное освобождение')::integer as partial,
	COUNT(*) FILTER (WHERE status = 'Идет полное освобождение' AND deviation <> 'Наступили риски' AND deviation <> 'Требует внимания')::integer as ok,
	COUNT(*) FILTER (WHERE status = 'Идет полное освобождение' AND deviation = ANY(ARRAY['Наступили риски', 'Требует внимания']))::integer as risk,
	COUNT(*) FILTER (WHERE status = 'Освобождение не начато')::integer as none	
FROM plots;