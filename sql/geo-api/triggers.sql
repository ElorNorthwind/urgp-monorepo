CREATE TRIGGER reon_layer155_updated_at_trigger
BEFORE UPDATE ON reon_local.layer155
FOR EACH ROW
EXECUTE FUNCTION data_mos.update_updated_at_column();