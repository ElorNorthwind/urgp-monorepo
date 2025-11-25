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
), apartment_totals AS (
    SELECT 
        building_id,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Риск'::varchar) as risk,
        COUNT(*) FILTER (WHERE (classificator->>'deviation')::varchar = 'Требует внимания'::varchar) as attention
        FROM renovation.apartments_old
    GROUP BY building_id
), building_deviations AS (
    SELECT 
		okrug,
        CASE
            WHEN (b.terms->>'doneDate')::date IS NOT NULL THEN 'Работа завершена'::text
            WHEN COALESCE(b.manual_relocation_type, b.relocation_type) = ANY(ARRAY[2,3]) OR b.moves_outside_district = true THEN 'Без отклонений'::text
            WHEN at.risk > 0 THEN 'Наступили риски'::text
            WHEN at.attention > 0 THEN 'Требует внимания'::text
            ELSE 'Без отклонений'::text
        END AS building_deviation,
		at.risk,
		at.attention
    FROM renovation.buildings_old b
    LEFT JOIN apartment_totals at ON at.building_id = b.id
)
SELECT  
    b.okrug, 
    COUNT(*) FILTER (WHERE b.building_deviation = 'Наступили риски')::integer as "riskHouses", 
    COUNT(*) FILTER (WHERE b.building_deviation = 'Требует внимания')::integer as "attentionHouses", 
    COALESCE(SUM(risk) FILTER (WHERE building_deviation = 'Наступили риски'),0)::integer as "riskApartments", 
    COALESCE(SUM(attention) FILTER (WHERE building_deviation = ANY(ARRAY['Наступили риски', 'Требует внимания'])),0)::integer as "attentionApartments" 
FROM building_deviations b 
LEFT JOIN ao_ordering ao ON b.okrug = ao.okrug 
GROUP BY b.okrug, ao.rank 
ORDER BY ao.rank; 