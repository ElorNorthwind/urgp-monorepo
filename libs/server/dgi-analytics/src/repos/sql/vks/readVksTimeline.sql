WITH date_series AS(  
    SELECT  
        *,    
        to_char(make_date(year, month, 1) , 'TMMonth YYYY') as period  
    FROM generate_series(1,12) as month 
    CROSS JOIN generate_series(2017,DATE_PART('year', NOW())::integer) as year  
    WHERE make_date(year, month, 1) BETWEEN CURRENT_TIMESTAMP - '25 month'::interval AND CURRENT_TIMESTAMP 
   AND year >= 2024
) 
SELECT   
    d.year::integer, 
    d.month::integer,  
    CASE WHEN d.year::integer = DATE_PART('year', NOW())::integer AND d.month::integer = DATE_PART('month', NOW())::integer THEN 'На сегодня' ELSE d.period END as period, 
 (COUNT(*) FILTER (WHERE s.property_type = 'Жилищные вопросы'))::integer as housing,
 (COUNT(*) FILTER (WHERE s.property_type <> 'Жилищные вопросы'))::integer as "nonHousing"
 
FROM date_series d
LEFT JOIN vks.cases c
    ON (DATE_PART('year', c.date)::integer = d.year::integer)  
    AND (DATE_PART('month', c.date)::integer = d.month::integer)  
LEFT JOIN vks.services s ON c.service_id = s.id
LEFT JOIN vks.departments dep ON s.department_id = dep.id
WHERE d.year IS NOT NULL 
$1:raw
GROUP BY  
    d.year, 
    d.month, 
    d.period 
ORDER BY  
    d.year, 
    d.month;