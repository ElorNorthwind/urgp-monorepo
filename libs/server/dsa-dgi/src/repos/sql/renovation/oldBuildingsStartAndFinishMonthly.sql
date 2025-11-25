WITH date_series AS (
    SELECT *, to_char(make_date(year, month, 1), 'TMMonth YYYY') as period
    FROM generate_series(1,12) as month
    CROSS JOIN generate_series(2017, DATE_PART('year', NOW())::integer) as year
    WHERE make_date(year, month, 1) BETWEEN NOW() - '1 years'::interval AND NOW()
), starts AS (
    SELECT 
        to_char((terms->'actual'->>'firstResetlementStart')::date , 'TMMonth YYYY') as period, 
        COUNT(*)::integer as total
    FROM renovation.buildings_old
    WHERE terms->'actual'->>'firstResetlementStart' IS NOT NULL
    GROUP BY 
    to_char((terms->'actual'->>'firstResetlementStart')::date , 'TMMonth YYYY')
), finishes AS (
    SELECT 
        to_char((terms->>'doneDate')::date , 'TMMonth YYYY') as period, 
        COUNT(*)::integer as total
    FROM renovation.buildings_old
    WHERE (terms->>'doneDate')::date IS NOT NULL
    GROUP BY 
    to_char((terms->>'doneDate')::date , 'TMMonth YYYY')
)
SELECT 
    d.period,
    COALESCE(s.total, 0) as starts,
    COALESCE(f.total, 0) as finishes
FROM date_series d 
LEFT JOIN starts s ON s.period = d.period
LEFT JOIN finishes f ON f.period = d.period
ORDER BY d.year, d.month;