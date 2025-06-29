WITH date_series AS(  
    SELECT  
        *,    
        to_char(make_date(year, month, 1) , 'TMMonth YYYY') as period  
    FROM generate_series(1,12) as month 
    CROSS JOIN generate_series(2017,DATE_PART('year', NOW())::integer) as year  
    WHERE make_date(year, month, 1) BETWEEN NOW() - '25 month'::interval AND NOW() 
) 
SELECT   
    d.year::integer, 
    d.month::integer,  
    d.period, 
	(COUNT(*) FILTER (WHERE o.egrn_status = ANY(ARRAY['Физ.лицо', 'Юр.лицо'])))::integer as given,
	(COUNT(*) FILTER (WHERE o.egrn_status = ANY(ARRAY['город Москва'])))::integer as taken
	
FROM date_series d
LEFT JOIN equity.objects o
    ON (DATE_PART('year', o.egrn_title_date)::integer = d.year::integer)  
    AND (DATE_PART('month', o.egrn_title_date)::integer = d.month::integer)  
WHERE d.year IS NOT NULL 
GROUP BY  
    d.year, 
    d.month, 
    d.period 
ORDER BY  
    d.year, 
    d.month;