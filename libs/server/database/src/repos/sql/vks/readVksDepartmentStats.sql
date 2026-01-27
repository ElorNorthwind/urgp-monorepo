WITH scheduale AS (
	SELECT 
		department_id, 
        wd, 
        wn,
		CASE WHEN wd = 5 THEN friday ELSE normal END as normal,
		CASE WHEN wd = 5 THEN friday_short ELSE normal_short END as short
	FROM (
		SELECT 
			s.department_id,
			(JSONB_ARRAY_ELEMENTS(g.schedule) ->> 'wd')::int as wd,
			JSONB_ARRAY_ELEMENTS(JSONB_ARRAY_ELEMENTS(g.schedule) -> 'wn')::int as wn,
			g.normal,
			g.friday,
			g.normal_short,
			g.friday_short
		FROM vks.services s
		LEFT JOIN vks.slot_groups g ON slot_group_id = g.id
		WHERE g.schedule IS NOT NULL
	) t
), slots AS (
    SELECT 
        s.department_id, 
        d.wd, 
        d.wn,
        SUM(s.normal)::int as normal,
        SUM(s.short)::int as short

    FROM (
        SELECT *
        FROM generate_series(1, 5) as wd
        CROSS JOIN generate_series(1, 6) as wn
    ) d
    LEFT JOIN scheduale s
    ON d.wd = s.wd AND (s.wn = d.wn OR s.wn = -1)
    GROUP BY s.department_id, d.wd, d.wn
), dep_slots AS (
	SELECT 
		s.department_id,
		SUM(CASE WHEN c.is_short THEN s.short ELSE s.normal END)::int as slots
	FROM dm.calendar c
	LEFT JOIN slots s ON c.weekday_legal = s.wd AND c.week_number = s.wn
	WHERE c.date BETWEEN ${dateFrom}::date AND ${dateTo}::date
	  AND s.department_id IS NOT NULL
	GROUP BY s.department_id
)

SELECT 
	d.id,
	d.display_name as department,
	COUNT(*)::integer as total,
	COALESCE(COUNT(*) FILTER(WHERE status = ANY(ARRAY['обслужен','не явился по вызову'])), 0)::integer as "slotsUsed",
	COALESCE(COUNT(*) FILTER(WHERE status = ANY(ARRAY['забронировано'])), 0)::integer as "slotsReserved",
	GREATEST(MAX(sl.slots) - COUNT(*) FILTER(WHERE status = ANY(ARRAY['обслужен','не явился по вызову', 'забронировано'])), 0)::integer as "slotsAvailable",
	COALESCE(COUNT(*) FILTER(WHERE operator_survey_id IS NOT NULL), 0)::integer as surveyed,
	COALESCE(COUNT(*) FILTER(WHERE operator_survey_id IS NULL), 0)::integer as unsurveyed,
    CASE 
		WHEN COUNT(*) > 0 THEN ROUND((COALESCE(COUNT(*) FILTER(WHERE operator_survey_id IS NOT NULL), 0)::numeric / COUNT(*)::numeric) * 100, 2) 
		ELSE 0 	
	END as "surveyedPercent",
	COALESCE(COUNT(*) FILTER(WHERE COALESCE(client_survey_grade, online_grade) IS NOT NULL), 0)::integer as graded,
	COALESCE(COUNT(*) FILTER(WHERE COALESCE(client_survey_grade, online_grade) IS NULL), 0)::integer as ungraded,
	ROUND(COALESCE(AVG(COALESCE(client_survey_grade, online_grade)) FILTER (WHERE is_technical <> true), 0), 2) as grade,
	CASE 
		WHEN COUNT(*) > 0 THEN ROUND((COALESCE(COUNT(*) FILTER(WHERE COALESCE(client_survey_grade, online_grade) IS NOT NULL), 0)::numeric / COUNT(*)::numeric) * 100, 2) 
		ELSE 0 	
	END as "gradedPercent"
FROM vks.cases c
LEFT JOIN vks.services s ON c.service_id = s.id
LEFT JOIN vks.departments d ON s.department_id = d.id
LEFT JOIN dep_slots sl ON sl.department_id = d.id
WHERE c.date BETWEEN ${dateFrom}::date AND ${dateTo}::date
${conditions:raw}
GROUP BY d.id, d.display_name
ORDER BY COUNT(*) DESC;