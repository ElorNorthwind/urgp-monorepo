-- OPERATIONS HISTORY TRIGGER
DROP TRIGGER IF EXISTS equity_operation_history_trigger ON equity.operations;

CREATE OR REPLACE FUNCTION control.equity_operation_history_trigger_func()
RETURNS trigger AS $body$
BEGIN
	if (TG_OP = 'CREATE') then
		INSERT INTO equity.operations_history (
            operation_id,
            object_id,
            claim_id,
            created_at,
            created_by_id,
            updated_at,
            updated_by_id,
            type_id,
            source,
            date,
            notes,
            fio,
            number,
            result,
            delete_date
		)
		VALUES(
            NEW.id,
            NEW.object_id,
            NEW.claim_id,
            NEW.created_at,
            NEW.created_by_id,
            NEW.updated_at,
            NEW.updated_by_id,
            NEW.type_id,
            NEW.source,
            NEW.date,
            NEW.notes,
            NEW.fio,
            NEW.number,
            NEW.result,
			null
		);
		RETURN NEW;

	elseif (TG_OP = 'UPDATE') then
		INSERT INTO equity.operations_history (
            operation_id,
            object_id,
            claim_id,
            created_at,
            created_by_id,
            updated_at,
            updated_by_id,
            type_id,
            source,
            date,
            notes,
            fio,
            number,
            result,
            delete_date
		)
		VALUES(
            NEW.id,
            NEW.object_id,
            NEW.claim_id,
            NEW.created_at,
            NEW.created_by_id,
            NEW.updated_at,
            NEW.updated_by_id,
            NEW.type_id,
            NEW.source,
            NEW.date,
            NEW.notes,
            NEW.fio,
            NEW.number,
            NEW.result,
			null
		);
		RETURN NEW;
	elsif (TG_OP = 'DELETE') then
		INSERT INTO equity.operations_history (
            operation_id,
            object_id,
            claim_id,
            created_at,
            created_by_id,
            updated_at,
            updated_by_id,
            type_id,
            source,
            date,
            notes,
            fio,
            number,
            result,
            delete_date
		)
		VALUES(
            OLD.id,
            OLD.object_id,
            OLD.claim_id,
            OLD.created_at,
            OLD.created_by_id,
            OLD.updated_at,
            OLD.updated_by_id,
            OLD.type_id,
            OLD.source,
            OLD.date,
            OLD.notes,
            OLD.fio,
            OLD.number,
            OLD.result,
			CURRENT_TIMESTAMP
		);
		RETURN OLD;
	end if;
	
END;
$body$
LANGUAGE plpgsql;

CREATE TRIGGER equity_operation_history_trigger
AFTER UPDATE OR DELETE ON equity.operations
FOR EACH ROW EXECUTE FUNCTION control.equity_operation_history_trigger_func();