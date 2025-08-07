SELECT 
	d.id,
	d.display_name as department,
	COUNT(*)::integer as total,
	COALESCE(COUNT(*) FILTER(WHERE operator_survey_id IS NOT NULL), 0)::integer as surveyed,
	COALESCE(COUNT(*) FILTER(WHERE operator_survey_id IS NULL), 0)::integer as unsurveyed,
    CASE 
		WHEN COUNT(*) > 0 THEN ROUND((COALESCE(COUNT(*) FILTER(WHERE operator_survey_id IS NOT NULL), 0)::numeric / COUNT(*)::numeric) * 100, 2) 
		ELSE 0 	
	END as "surveyedPercent",
	COALESCE(COUNT(*) FILTER(WHERE COALESCE(client_survey_grade, online_grade) IS NOT NULL), 0)::integer as graded,
	COALESCE(COUNT(*) FILTER(WHERE COALESCE(client_survey_grade, online_grade) IS NULL), 0)::integer as ungraded,
	ROUND(COALESCE(AVG(COALESCE(client_survey_grade, online_grade)), 0), 2) as grade,
	CASE 
		WHEN COUNT(*) > 0 THEN ROUND((COALESCE(COUNT(*) FILTER(WHERE COALESCE(client_survey_grade, online_grade) IS NOT NULL), 0)::numeric / COUNT(*)::numeric) * 100, 2) 
		ELSE 0 	
	END as "gradedPercent"
FROM vks.cases c
LEFT JOIN vks.services s ON c.service_id = s.id
LEFT JOIN vks.departments d ON s.department_id = d.id
WHERE c.date BETWEEN ${dateFrom}::date AND ${dateTo}::date
${conditions:raw}
GROUP BY d.id, d.display_name
ORDER BY COUNT(*) DESC;