WITH expected_stages AS (
	SELECT 
		LAG(expected_done_days) OVER w_days as plan_date,
		id as needed_stage_id,
		done_status_text
	FROM renovation.apartment_stages
	WHERE is_vital = true
	WINDOW w_days AS (ORDER BY expected_done_days NULLS LAST)
	ORDER BY expected_done_days NULLS LAST
), apartment_dates AS (
	SELECT key, (value->>'id')::int as id, (value->>'date')::date as date
	FROM renovation.apartments_old_temp r, jsonb_each(stages_dates)
	WHERE r.id = ${id}
), start_date AS (
	SELECT date as start_date
	FROM apartment_dates
	WHERE id = 0
)
SELECT 
	s.needed_stage_id as id,
	s.done_status_text as status,
	sd.start_date + s.plan_date AS "planDate",
	d.date as "doneDate"
FROM expected_stages s
LEFT JOIN apartment_dates d ON d.id = s.needed_stage_id
LEFT JOIN start_date sd ON true
WHERE s.plan_date IS NOT NULL
ORDER BY s.plan_date;