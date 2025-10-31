
-- Updated at on row modification
CREATE OR REPLACE FUNCTION address.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resolution_updated_at_trigger
BEFORE UPDATE ON address.transport_stations
FOR EACH ROW
EXECUTE FUNCTION address.update_updated_at_column();