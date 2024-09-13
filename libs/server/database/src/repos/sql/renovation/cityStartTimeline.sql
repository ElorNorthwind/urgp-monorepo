WITH building_dates AS ( 
 SELECT 
  min(control_date) FILTER (WHERE date_type = 5) AS plan_first_resettlement_start,
  min(control_date) FILTER (WHERE date_type = 1) AS actual_first_resettlement_start
 FROM ( 
  SELECT 
   building_id,
   date_type,
   control_date,
   rank() OVER (PARTITION BY building_id, date_type ORDER BY updated_at DESC, id) AS rank
  FROM renovation.dates_buildings_old
 ) d WHERE d.rank = 1
GROUP BY building_id
), series AS (
 SELECT generate_series(
  DATE_TRUNC('MONTH', NOW() - INTERVAL '8 months')::date,
  (DATE_TRUNC('MONTH', NOW() + INTERVAL '13 months') - INTERVAL '1 day')::date,
  '1 Month'
 ) as step
), intervals AS(
 SELECT 
  DATE_PART('year', step)::integer as year, 
  DATE_PART('month', step)::integer as month,
  TO_CHAR(step, 'TMMon') as label
 FROM series
)
SELECT 
 i.year, i.month, i.label,
  COUNT(*) FILTER(WHERE actual_first_resettlement_start IS NOT NULL)::integer as started,
  COUNT(*) FILTER(WHERE actual_first_resettlement_start IS NULL)::integer as planned
FROM intervals i 
LEFT JOIN building_dates d ON i.year = DATE_PART('year', plan_first_resettlement_start)::integer 
                          AND i.month = DATE_PART('month', plan_first_resettlement_start)::integer
GROUP BY i.year, i.month, i.label
ORDER BY i.year, i.month;