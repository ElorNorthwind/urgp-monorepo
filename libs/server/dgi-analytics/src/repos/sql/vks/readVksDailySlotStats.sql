WITH weekdays(wd, name) AS (
	VALUES
	(1, 'пн'),
    (2, 'вт'),
    (3, 'ср'),
    (4, 'чт'),
    (5, 'пт')
--     (6, 'сб'),
--     (7, 'вс')
), work_hours(time, indicator, name) AS (
	VALUES
	('08:00:00'::time, '08', '08:00-09:00'),
    ('09:00:00'::time, '09', '09:00-10:00'),
    ('10:00:00'::time, '10', '10:00-11:00'),
    ('11:00:00'::time, '11', '11:00-12:00'),
    ('12:00:00'::time, '12', '12:00-13:00'),
    ('13:00:00'::time, '13', '13:00-14:00'),
    ('14:00:00'::time, '14', '14:00-15:00'),
    ('15:00:00'::time, '15', '15:00-16:00'),
    ('16:00:00'::time, '16', '16:00-17:00')
), workdays_and_hours AS (
    SELECT 
        wd.wd, 
        wd.name as wd_name, 
        wh.indicator,
        wh.name as wh_name,
		wh.time
    FROM weekdays wd
    CROSS JOIN work_hours wh
-- 	ORDER BY wd.wd, wh.time
), slot_data AS (
    SELECT 
        COALESCE(ca.weekday_legal, DATE_PART('isodow', c.date)) as wd,
        LEFT(c.time, 2) as indicator,
        COALESCE(COUNT(*) FILTER(WHERE c.status = ANY(ARRAY['обслужен','не явился по вызову'])), 0)::integer as used,
        COALESCE(COUNT(*) FILTER(WHERE c.status = ANY(ARRAY['забронировано'])), 0)::integer as reserved,
        COALESCE(COUNT(*) FILTER(WHERE c.status = ANY(ARRAY['пустой слот'])), 0)::integer as available,
        COUNT(*)::int as total
    FROM vks.cases c
    LEFT JOIN vks.services s ON c.service_id = s.id
    LEFT JOIN dm.calendar ca ON c.date = ca.date
	WHERE c.date BETWEEN ${dateFrom}::date AND ${dateTo}::date
	${conditions:raw}
    GROUP BY 
        COALESCE(ca.weekday_legal, DATE_PART('isodow', c.date)),
        LEFT(c.time, 2)
)
SELECT 
    w.wd_name as "weekday",
    w.wh_name as "hour",
    COALESCE(s.used, 0) as "slotsUsed",
    COALESCE(s.reserved, 0) as "slotsReserved",
    COALESCE(s.available, 0) as "slotsAvailable",
    COALESCE(s.total, 0) as "slotsTotal"
FROM workdays_and_hours w 
LEFT JOIN slot_data s ON w.wd = s.wd AND w.indicator = s.indicator
ORDER BY w.wd, w.time;




