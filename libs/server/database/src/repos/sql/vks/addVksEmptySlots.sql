WITH full_slots AS (
    SELECT 
        group_id,
        week_day,
        week_nums,
        slot_length as length,
        unnest(slots) as slot
    FROM 
        vks.slot_schedule v
), short_slots AS (
    SELECT 
        group_id,
        week_day,
        week_nums,
        slot_length as length,
        unnest(slots_short) as slot
    FROM 
        vks.slot_schedule v
), weekly_slots AS (
    SELECT
        group_id,
        week_day,
        week_nums,
        slot as start_time,
        length,
        slot::varchar || '-' || (slot + (length || ' minutes')::interval)::varchar as slot_text,
        false as is_short
    FROM
        full_slots

    UNION ALL

    SELECT
        group_id,
        week_day,
        week_nums,
        slot as start_time,
        length,
        slot::varchar || '-' || (slot + (length || ' minutes')::interval)::varchar as slot_text,
        true as is_short
    FROM
        short_slots
), slots AS (
    SELECT 
        group_id,
        week_day,
        unnest(week_nums) as week_num,
        start_time,
        length,
        slot_text,
        is_short
    FROM weekly_slots
), avaliable_slots AS (
    SELECT 
        c.date, 
        s.group_id, 
        s.slot_text
    FROM dm.calendar c 
    LEFT JOIN slots s ON 
            c.weekday_legal = s.week_day 
        AND c.week_number = s.week_num
        AND c.is_short = s.is_short
    WHERE c.is_workday AND s.group_id IS NOT NULL AND c.date BETWEEN ${dateFrom}::date AND ${dateTo}::date
), empty_slots AS (
    SELECT
        'Департамент городского имущества города Москвы' as org,
        t.date,
        t.slot_text as time,
        gr.id as service_id,
        'пустой слот' as status,
        CURRENT_TIMESTAMP as booking_date,
        LPAD(t.group_id::text, 2, '0') || '-' || TO_CHAR(t.date, 'DD.MM.YYYY') || '-' || LEFT(t.slot_text, 5) as booking_code,
        'График онлайн-консультаций' as booking_source,
        'Невостребованный слот онлайн-консультации' as booking_resource,
        CASE WHEN c.status IS NOT NULL THEN COALESCE(c.status, 'пустой слот') || COALESCE( ' (' || cl.short_name || ')', '') ELSE 'отсутствуют записи на это время' END as problem_summary,
        0::bigint AS client_id
        
    FROM avaliable_slots t

    LEFT JOIN (
        SELECT DISTINCT ON (se.slot_group_id, ca.date, ca.time) 
            ca.*, 
            se.slot_group_id
        FROM vks.cases ca
        LEFT JOIN vks.services se ON ca.service_id = se.id
        WHERE ca.status NOT IN ('обслужен', 'не явился по вызову', 'пустой слот', 'забронировано')
        ORDER BY se.slot_group_id, ca.date, ca.time, ca.created_at DESC
    ) c ON c.date = t.date AND c.time = t.slot_text AND c.slot_group_id = t.group_id

    LEFT JOIN (
        SELECT DISTINCT ON (se.slot_group_id, ca.date, ca.time) 
            ca.status,
            ca.date,
            ca.time, 
            se.slot_group_id
        FROM vks.cases ca
        LEFT JOIN vks.services se ON ca.service_id = se.id
        WHERE ca.status IN ('обслужен', 'не явился по вызову', 'пустой слот', 'забронировано')
        ORDER BY se.slot_group_id, ca.date, ca.time, ca.created_at DESC
    ) ex ON ex.date = t.date AND ex.time = t.slot_text AND ex.slot_group_id = t.group_id

    LEFT JOIN (SELECT DISTINCT ON (slot_group_id) slot_group_id, id FROM vks.services ORDER BY slot_group_id, id) gr ON gr.slot_group_id = t.group_id
    LEFT JOIN vks.clients cl ON cl.id = c.client_id
    WHERE ex.status IS NULL
    ORDER BY 
        t.date, 
        t.slot_text, 
        c.slot_group_id
)

INSERT INTO vks.cases (org, date, time, service_id, status, booking_date, booking_code, booking_source, booking_resource, problem_summary, client_id)
SELECT * FROM empty_slots
ON CONFLICT (booking_code, date)
DO UPDATE 
SET problem_summary = EXCLUDED.problem_summary;