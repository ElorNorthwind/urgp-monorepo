
-- Updated at on row modification
CREATE OR REPLACE FUNCTION vks.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at_trigger
BEFORE UPDATE ON vks.clients
FOR EACH ROW
EXECUTE FUNCTION vks.update_updated_at_column();

CREATE TRIGGER cases_updated_at_trigger
BEFORE UPDATE ON vks.cases
FOR EACH ROW
EXECUTE FUNCTION vks.update_updated_at_column();

-- Client slots count
CREATE OR REPLACE FUNCTION vks.count_client_slots()
RETURNS TRIGGER AS $$
BEGIN
    if (TG_OP = 'INSERT') THEN
        UPDATE vks.clients cl
        SET consult_count = COALESCE(c.total, 0),
            first_consult_at = COALESCE(c.date, CURRENT_DATE)
        FROM (SELECT COUNT(*) as total, MIN(date) as date FROM vks.cases WHERE client_id = NEW.client_id AND client_id <> 0) c 
        WHERE cl.id = NEW.client_id;
		RETURN NEW;
	elseif (TG_OP = 'UPDATE') THEN
        UPDATE vks.clients cl
        SET consult_count = COALESCE(c.total, 0),
            first_consult_at = COALESCE(c.date, CURRENT_DATE)
        FROM (SELECT COUNT(*) as total, MIN(date) as date FROM vks.cases WHERE client_id = NEW.client_id AND client_id <> 0) c 
        WHERE cl.id = NEW.client_id;
        if (OLD.client_id != NEW.client_id) THEN
            UPDATE vks.clients cl
            SET consult_count = COALESCE(c.total, 0),
                first_consult_at = COALESCE(c.date, CURRENT_DATE)
            FROM (SELECT COUNT(*) as total, MIN(date) as date FROM vks.cases WHERE client_id = OLD.client_id AND client_id <> 0) c 
            WHERE cl.id = OLD.client_id;
        end if;
		RETURN NEW;
	elseif (TG_OP = 'DELETE') THEN
        UPDATE vks.clients cl
        SET consult_count = COALESCE(c.total, 0),
            first_consult_at = COALESCE(c.date, CURRENT_DATE)
        FROM (SELECT COUNT(*) as total, MIN(date) as date FROM vks.cases WHERE client_id = OLD.client_id AND client_id <> 0) c 
        WHERE cl.id = OLD.client_id;
        RETURN OLD;
	end if;

END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_update_client_count_trigger
AFTER INSERT OR DELETE OR UPDATE OF client_id ON vks.cases
FOR EACH ROW
EXECUTE FUNCTION vks.count_client_slots();