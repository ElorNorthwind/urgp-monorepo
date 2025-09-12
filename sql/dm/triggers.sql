
-- Updated at on row modification
CREATE OR REPLACE FUNCTION dm.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resolution_updated_at_trigger
BEFORE UPDATE ON dm.resolutions
FOR EACH ROW
EXECUTE FUNCTION dm.update_updated_at_column();