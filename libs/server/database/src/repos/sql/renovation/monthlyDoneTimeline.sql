WITH building_ages AS (   
    SELECT    
        CASE   
            WHEN b.terms->'actual'->>'firstResetlementStart' IS NOT NULL THEN COALESCE((b.terms->>'doneDate')::date,  NOW()) - (b.terms->'actual'->>'firstResetlementStart')::date  
            ELSE null  
        END as age,  
        DATE_PART('year', COALESCE((b.terms->>'doneDate')::date,  NOW())) as done_year,   
        DATE_PART('month', COALESCE((b.terms->>'doneDate')::date,  NOW())) as done_month,   
            to_char((b.terms->>'doneDate')::date, 'TMMonth YYYY') as period, 
        COALESCE(b.manual_relocation_type, b.relocation_type) = 1 OR b.terms->>'partialEnd' IS NOT NULL AS is_full,  
        (b.terms->>'doneDate')::date IS NOT NULL AS is_done  
    FROM renovation.buildings_old b  
    WHERE (b.terms->>'doneDate')::date >= date_trunc('month', NOW() - '2 year'::interval) -- последние Х лет
), prepared_data AS (   
    SELECT    
        *,   
        CASE   
            WHEN age < '5 month' THEN 'Менее 5 месяцев'   
            WHEN age < '8 month' THEN 'От 5 до 8 месяцев'   
            ELSE 'Более 8 месяцев'   
        END as relocation_age,   
        CASE   
            WHEN age < '5 month' THEN 3   
            WHEN age < '8 month' THEN 4   
            ELSE 5   
        END as age_priority   
    FROM building_ages   
)   
SELECT    
    done_year::integer as year,   
    done_month::integer as month,   
    period, 
 
    COUNT(*) FILTER (WHERE relocation_age = 'Менее 5 месяцев')::integer as "0",   
    COUNT(*) FILTER (WHERE relocation_age = 'От 5 до 8 месяцев')::integer as "5",   
    COUNT(*) FILTER (WHERE relocation_age = 'Более 8 месяцев')::integer as "8",  
  
    COUNT(*) FILTER (WHERE is_full = true AND relocation_age = 'Менее 5 месяцев')::integer as "0f",   
    COUNT(*) FILTER (WHERE is_full = true AND relocation_age = 'От 5 до 8 месяцев')::integer as "5f",   
    COUNT(*) FILTER (WHERE is_full = true AND relocation_age = 'Более 8 месяцев')::integer as "8f"   
FROM prepared_data   
WHERE is_done = true  
GROUP BY   
    done_year, 
    done_month,   
    period 
ORDER BY    
    done_year, 
    done_month;