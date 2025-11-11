-- Updated at on row modification
CREATE OR REPLACE FUNCTION data_mos.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resolution_updated_at_trigger
BEFORE UPDATE ON data_mos.transport_stations
FOR EACH ROW
EXECUTE FUNCTION data_mos.update_updated_at_column();

CREATE TRIGGER resolution_updated_at_trigger
BEFORE UPDATE ON data_mos.address_registry
FOR EACH ROW
EXECUTE FUNCTION data_mos.update_updated_at_column();