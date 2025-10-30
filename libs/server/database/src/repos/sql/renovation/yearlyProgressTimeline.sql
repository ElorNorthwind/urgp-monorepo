WITH date_series AS (
	SELECT *, make_date(year, 1, 1) as year_start
	FROM generate_series(DATE_PART('year', NOW())::integer - 5, DATE_PART('year', NOW())::integer) as year
)

SELECT   
    d.year::integer, 

    COUNT(*) FILTER (WHERE AGE(d.year_start, (b.terms->'actual'->>'firstResetlementStart')::date) <= '5 month')::integer as "lt5",  
    COUNT(*) FILTER (WHERE AGE(d.year_start, (b.terms->'actual'->>'firstResetlementStart')::date) BETWEEN '5 month'::interval + '1 day'::interval AND '8 month')::integer as "5t8", 
    COUNT(*) FILTER (WHERE AGE(d.year_start, (b.terms->'actual'->>'firstResetlementStart')::date) > '8 month')::integer as "gt8", 
    COUNT(*)::integer as total, 
  
    COUNT(*) FILTER (WHERE (COALESCE(b.manual_relocation_type, b.relocation_type) = 1 OR b.terms->>'partialEnd' IS NOT NULL) AND AGE(d.year_start, (b.terms->'actual'->>'firstResetlementStart')::date) <= '5 month')::integer as "lt5f",  
    COUNT(*) FILTER (WHERE (COALESCE(b.manual_relocation_type, b.relocation_type) = 1 OR b.terms->>'partialEnd' IS NOT NULL) AND AGE(d.year_start, (b.terms->'actual'->>'firstResetlementStart')::date) BETWEEN '5 month'::interval + '1 day'::interval AND '8 month')::integer as "5t8f", 
    COUNT(*) FILTER (WHERE (COALESCE(b.manual_relocation_type, b.relocation_type) = 1 OR b.terms->>'partialEnd' IS NOT NULL) AND AGE(d.year_start, (b.terms->'actual'->>'firstResetlementStart')::date) > '8 month')::integer as "gt8f", 
    COUNT(*) FILTER (WHERE COALESCE(b.manual_relocation_type, b.relocation_type) = 1 OR b.terms->>'partialEnd' IS NOT NULL)::integer as "totalF" 
FROM renovation.buildings_old b 
LEFT JOIN date_series d   
    ON ((b.terms->'actual'->>'firstResetlementStart')::date <= d.year_start)  
    AND (b.terms->>'doneDate' IS NULL OR (b.terms->>'doneDate')::date > d.year_start) 
WHERE d.year IS NOT NULL 
GROUP BY  
    d.year
ORDER BY  
    d.year;