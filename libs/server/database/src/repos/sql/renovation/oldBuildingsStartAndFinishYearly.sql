WITH starts AS (
    SELECT 
        DATE_PART('year', (terms->'actual'->>'firstResetlementStart')::date) as period, 
        COUNT(*)::integer as total
    FROM renovation.buildings_old
    WHERE terms->'actual'->>'firstResetlementStart' IS NOT NULL
    GROUP BY 
    DATE_PART('year', (terms->'actual'->>'firstResetlementStart')::date)
), finishes AS (
    SELECT 
        DATE_PART('year', (terms->>'doneDate')::date) as period, 
        COUNT(*)::integer as total
    FROM renovation.buildings_old
    WHERE terms->>'doneDate' IS NOT NULL
    GROUP BY 
    DATE_PART('year', (terms->>'doneDate')::date)
)
SELECT 
    s.period::text,
    COALESCE(s.total, 0) as starts,
    COALESCE(f.total, 0) as finishes
FROM starts s
LEFT JOIN finishes f ON f.period = s.period
ORDER BY s.period;