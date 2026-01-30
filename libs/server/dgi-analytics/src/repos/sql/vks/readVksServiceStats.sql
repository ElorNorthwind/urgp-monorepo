SELECT 
	s.short_name as service,
	s.display_name as name,
	COUNT(*)::integer as total,
	COALESCE(COUNT(*) FILTER(WHERE status = ANY(ARRAY['обслужен','не явился по вызову', 'забронировано', 'пустой слот'])), 0)::integer as "slotsTotal",
	COALESCE(COUNT(*) FILTER(WHERE status = ANY(ARRAY['обслужен','не явился по вызову'])), 0)::integer as "slotsUsed",
	COALESCE(COUNT(*) FILTER(WHERE status = ANY(ARRAY['забронировано'])), 0)::integer as "slotsReserved",
	COALESCE(COUNT(*) FILTER(WHERE status = ANY(ARRAY['пустой слот'])), 0)::integer as "slotsAvailable",
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
WHERE c.date BETWEEN ${dateFrom}::date AND ${dateTo}::date
${conditions:raw}
GROUP BY s.short_name, s.display_name
ORDER BY COUNT(*) FILTER(WHERE status = ANY(ARRAY['обслужен','не явился по вызову', 'забронировано', 'пустой слот'])) DESC;