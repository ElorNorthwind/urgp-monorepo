WITH ao_ordering(okrug, rank) AS ( 
    VALUES 
    ('ЦАО',1), 
    ('САО',2), 
    ('СВАО',3), 
    ('ВАО',4), 
    ('ЮВАО',5), 
    ('ЮАО',6), 
    ('ЮЗАО',7), 
    ('ЗАО',8), 
    ('СЗАО',9), 
    ('ЗелАО',10), 
    ('ТАО',11), 
    ('НАО',12) 
) 
SELECT  
    b.okrug, 
    COUNT(*) FILTER (WHERE building_deviation = 'Наступили риски')::integer as "riskHouses", 
    COUNT(*) FILTER (WHERE building_deviation = 'Требует внимания')::integer as "attentionHouses", 
    SUM((apartments->'deviationMFR'->>'risk')::integer) FILTER (WHERE building_deviation = 'Наступили риски')::integer as "riskApartments", 
    SUM((apartments->'deviationMFR'->>'attention')::integer) FILTER (WHERE building_deviation = ANY(ARRAY['Наступили риски', 'Требует внимания']))::integer as "attentionApartments" 
FROM renovation.old_buildings_full b 
LEFT JOIN ao_ordering ao ON b.okrug = ao.okrug 
GROUP BY b.okrug, ao.rank 
ORDER BY ao.rank;