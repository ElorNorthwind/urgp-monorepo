SELECT *
FROM (
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
        DISTINCT ON (s.plan_date, s.needed_stage_id)
        s.needed_stage_id as id,
        s.done_status_text as status,
        sd.start_date + s.plan_date AS "planDate",
        d.date as "doneDate"
    FROM expected_stages s
    LEFT JOIN apartment_dates d ON d.id = s.needed_stage_id OR (s.needed_stage_id = 26 AND d.id = ANY(ARRAY[27, 28, 67, 68, 42, 69, 70, 71])) 
    LEFT JOIN start_date sd ON true
    WHERE s.plan_date IS NOT NULL

    UNION

    SELECT 
        -1 as id,
        'Устранение дефектов' as status,
        COALESCE(defect_changed_done_date, defect_complaint_date + 90, defect_entry_date + 90, defect_actual_done_date) as "planDate",
        CASE WHEN defect_is_done = true THEN COALESCE(defect_actual_done_date, defect_changed_done_date, defect_complaint_date + 90, defect_entry_date + 90, defect_actual_done_date) ELSE null END as "doneDate"
    FROM renovation.apartment_connections c
    LEFT JOIN renovation.apartments_new a ON c.new_apart_id = a.id
    WHERE c.old_apart_id = ${id}
    AND COALESCE(defect_changed_done_date, defect_complaint_date, defect_entry_date, defect_actual_done_date) IS NOT NULL
) s
ORDER BY s."planDate", s.id;