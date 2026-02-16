WITH wd AS (
SELECT 
 COUNT(*) as days
FROM dm.calendar
 WHERE date BETWEEN ${dateFrom}::date AND ${dateTo}::date
)

SELECT 
 COALESCE(initcap(replace(replace(regexp_replace(c.operator_survey_fio, '(^[А-Яа-яёЁ\-]*)\s([А-Яа-яёЁ])(?:[А-Яа-яёЁ\-]*[\s\.]+([А-Яа-яёЁ]))?.*$'::text, '\1 \2.\3.'::text), '..'::text, '.'::text), '  '::text, ' '::text)), 'Не заполнена анкета') AS "operator",
 COUNT(*)::int as total,
 COUNT(*) FILTER(WHERE COALESCE(c.online_grade, c.client_survey_grade) = 1 AND c.is_technical = false)::int as "g1",
 COUNT(*) FILTER(WHERE COALESCE(c.online_grade, c.client_survey_grade) = 2 AND c.is_technical = false)::int as "g2",
 COUNT(*) FILTER(WHERE COALESCE(c.online_grade, c.client_survey_grade) = 3 AND c.is_technical = false)::int as "g3",
 COUNT(*) FILTER(WHERE COALESCE(c.online_grade, c.client_survey_grade) = 4 AND c.is_technical = false)::int as "g4",
 COUNT(*) FILTER(WHERE COALESCE(c.online_grade, c.client_survey_grade) = 5 AND c.is_technical = false)::int as "g5",
 ROUND(COUNT(*) FILTER(WHERE COALESCE(c.online_grade, c.client_survey_grade) IS NOT NULL AND c.is_technical = false)::numeric / COUNT(*)::numeric, 4) as graded,
 ROUND(AVG(COALESCE(c.online_grade, c.client_survey_grade)) FILTER(WHERE c.is_technical = false), 2) as grade,
 MAX(wd.days)::int as wd,
 ROUND(COUNT(*)::numeric / MAX(wd.days)::numeric, 2) as load
FROM vks.cases c
LEFT JOIN vks.services s ON s.id = c.service_id, wd
WHERE c.status = ANY(ARRAY['обслужен', 'не явился по вызову'])
AND c.date BETWEEN ${dateFrom}::date AND ${dateTo}::date
${conditions:raw}
GROUP BY COALESCE(initcap(replace(replace(regexp_replace(c.operator_survey_fio, '(^[А-Яа-яёЁ\-]*)\s([А-Яа-яёЁ])(?:[А-Яа-яёЁ\-]*[\s\.]+([А-Яа-яёЁ]))?.*$'::text, '\1 \2.\3.'::text), '..'::text, '.'::text), '  '::text, ' '::text)), 'Не заполнена анкета');