WITH date_series AS(  
    SELECT  
        *,    
        make_date(year, month, 1) as month_date, 
        to_char(make_date(year, month, 1) , 'TMMonth YYYY') as period  
    FROM generate_series(1,12) as month 
    CROSS JOIN generate_series(2017,DATE_PART('year', NOW())::integer) as year  
    WHERE make_date(year, month, 1) BETWEEN NOW() - '25 month'::interval AND NOW() 
     
    UNION 
 
    SELECT   
        13 as month,   
        DATE_PART('year', NOW()) as year,  
        NOW() as month_date,   
        'На сегодня' as period 
) 
 
SELECT   
    d.year::integer, 
    d.month::integer,  
    d.period, 
    COUNT(*) FILTER (WHERE AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) <= '5 month')::integer as "lt5",  
    COUNT(*) FILTER (WHERE AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) BETWEEN '5 month'::interval + '1 day'::interval AND '8 month')::integer as "5t8", 
    COUNT(*) FILTER (WHERE AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) > '8 month')::integer as "gt8", 
    COUNT(*)::integer as total, 
  
    COUNT(*) FILTER (WHERE (COALESCE(b.manual_relocation_type, b.relocation_type) = 1 OR b.terms->>'partialEnd' IS NOT NULL) AND AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) <= '5 month')::integer as "lt5f",  
    COUNT(*) FILTER (WHERE (COALESCE(b.manual_relocation_type, b.relocation_type) = 1 OR b.terms->>'partialEnd' IS NOT NULL) AND AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) BETWEEN '5 month'::interval + '1 day'::interval AND '8 month')::integer as "5t8f", 
    COUNT(*) FILTER (WHERE (COALESCE(b.manual_relocation_type, b.relocation_type) = 1 OR b.terms->>'partialEnd' IS NOT NULL) AND AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) > '8 month')::integer as "gt8f", 
    COUNT(*) FILTER (WHERE COALESCE(b.manual_relocation_type, b.relocation_type) = 1 OR b.terms->>'partialEnd' IS NOT NULL)::integer as "totalF" 
FROM renovation.buildings_old b 
LEFT JOIN date_series d   
    ON ((b.terms->'actual'->>'firstResetlementStart')::date <= d.month_date)  
    AND (b.terms->>'doneDate' IS NULL OR (b.terms->>'doneDate')::date > d.month_date) 
WHERE d.year IS NOT NULL 
GROUP BY  
    d.year, 
    d.month, 
    d.period 
ORDER BY  
    d.year, 
    d.month;