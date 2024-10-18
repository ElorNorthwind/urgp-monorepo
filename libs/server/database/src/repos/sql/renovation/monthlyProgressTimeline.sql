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
    COUNT(*) FILTER (WHERE AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) <= '3 month')::integer as "ltThreeM", 
    COUNT(*) FILTER (WHERE AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) BETWEEN '3 month'::interval + '1 day'::interval AND '8 month')::integer as "threeToEightM",
    COUNT(*) FILTER (WHERE AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) BETWEEN '8 month'::interval + '1 day'::interval AND '12 month')::integer as "eightToTwelveM", 
    COUNT(*) FILTER (WHERE AGE(d.month_date, (b.terms->'actual'->>'firstResetlementStart')::date) > '12 month')::integer as "gtTwelveM",
    COUNT(*)::integer as total
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