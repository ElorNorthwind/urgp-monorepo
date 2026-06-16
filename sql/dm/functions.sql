CREATE FUNCTION dm.add_business_days(
    start_date date,
    days integer
) RETURNS date AS $$
    DECLARE
        end_date date;
    BEGIN
		SELECT date
		FROM dm.calendar
		WHERE date >= start_date::date -- Стартовая дата входит в срок
		  AND is_workday  
		ORDER BY date
		LIMIT 1 OFFSET GREATEST(days - 1, 0)  -- Срок -1
		INTO end_date;
		RETURN end_date;
    END;
$$ LANGUAGE plpgsql STABLE;


CREATE TYPE dm.range_bounds AS ENUM ('[]', '()', '(]', '[)');
CREATE OR REPLACE FUNCTION dm.business_days_between(
    start_date date,
    end_date date,
	bounds dm.range_bounds DEFAULT '[]'
) RETURNS integer AS $$
	DECLARE
		days_count integer;
    BEGIN
		SELECT COUNT(*)::int as count
		FROM dm.calendar
		WHERE date BETWEEN 
		(CASE WHEN SUBSTR(bounds::varchar, 1, 1) = '(' THEN start_date::date + INTERVAL '1 day' ELSE start_date::date END)
		AND 
		(CASE WHEN SUBSTR(bounds::varchar, 2, 1) = ')' THEN end_date::date - INTERVAL '1 day' ELSE end_date::date END)
		  
		  AND is_workday
		INTO days_count;
		RETURN days_count;
    END;
$$ LANGUAGE plpgsql STABLE;


-- suspences length trigger
CREATE OR REPLACE FUNCTION dm.udate_suspence_length_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.term = 
        CASE 
        WHEN NEW.start_date IS NULL OR (NEW.due_date IS NULL AND NEW.done_date IS NULL) THEN
            0
        WHEN NEW.term_type = 'РД' THEN
            dm.business_days_between(NEW.start_date, COALESCE(NEW.done_date, NEW.due_date)) 
        ELSE
            COALESCE(NEW.done_date, NEW.due_date) - NEW.start_date + 1
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
----
CREATE TRIGGER dm_suspences_before_update_trigger
    BEFORE INSERT OR UPDATE ON dm.suspences
    FOR EACH ROW
    EXECUTE FUNCTION dm.udate_suspence_length_trigger();
