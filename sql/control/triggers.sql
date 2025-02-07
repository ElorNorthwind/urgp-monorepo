-- CASES HISTORY TRIGGER
DROP TRIGGER IF EXISTS case_history_trigger ON control.cases_;

CREATE OR REPLACE FUNCTION control.case_history_trigger_func()
RETURNS trigger AS $body$
BEGIN
	if (TG_OP = 'UPDATE') then
		INSERT INTO control.cases_history (
			case_id,
			class,
			type_id,
			author_id,
			updated_by_id,
			approve_from_id,
			approve_to_id,
			approve_status,
			approve_date,
			approve_notes,
			created_at,
			updated_at,
			external_cases,
			direction_ids,
			title,
			notes,
			extra,
			archive_date,
			delete_date
		)
		VALUES(
			NEW.id,
			NEW.class,
			NEW.type_id,
			NEW.author_id,
			NEW.updated_by_id,
			NEW.approve_from_id,
			NEW.approve_to_id,
			NEW.approve_status,
			NEW.approve_date,
			NEW.approve_notes,
			NEW.created_at,
			NEW.updated_at,
			NEW.external_cases,
			NEW.direction_ids,
			NEW.title,
			NEW.notes,
			NEW.extra,
			NEW.archive_date
		);
				
		RETURN NEW;
	elsif (TG_OP = 'DELETE') then
		INSERT INTO control.cases_history (
			case_id,
			class,
			type_id,
			author_id,
			updated_by_id,
			approve_from_id,
			approve_to_id,
			approve_status,
			approve_date,
			approve_notes,
			created_at,
			updated_at,
			external_cases,
			direction_ids,
			title,
			notes,
			extra,
			archive_date,
			delete_date
		)
		VALUES(
			OLD.id,
			OLD.class,
			OLD.type_id,
			OLD.author_id,
			OLD.updated_by_id,
			OLD.approve_from_id,
			OLD.approve_to_id,
			OLD.approve_status,
			OLD.approve_date,
			OLD.approve_notes,
			OLD.created_at,
			OLD.updated_at,
			OLD.external_cases,
			OLD.direction_ids,
			OLD.title,
			OLD.notes,
			OLD.extra,
			OLD.archive_date,
			CURRENT_TIMESTAMP
		);
		RETURN OLD;
	end if;

END;
$body$
LANGUAGE plpgsql;

CREATE TRIGGER case_history_trigger
AFTER UPDATE OR DELETE ON control.cases_
FOR EACH ROW EXECUTE FUNCTION control.case_history_trigger_func();


-- OPERATIONS HISTORY TRIGGER
DROP TRIGGER IF EXISTS operation_history_trigger ON control.operations_;

CREATE OR REPLACE FUNCTION control.operation_history_trigger_func()
RETURNS trigger AS $body$
BEGIN
	if (TG_OP = 'UPDATE') then
		INSERT INTO control.operations_history (
			operation_id,
			case_id,
			class,
			type_id,
			author_id,
			updated_by_id,
			approve_from_id,
			approve_to_id,
			approve_status,
			approve_date,
			approve_notes,
			created_at,
			updated_at,
			due_date,
			done_date,
			control_from_id,
			control_to_id,
			title,
			notes,
			extra,
			archive_date,
			delete_date
		)
		VALUES(
			NEW.id,
			NEW.case_id,
			NEW.class,
			NEW.type_id,
			NEW.author_id,
			NEW.updated_by_id,
			NEW.approve_from_id,
			NEW.approve_to_id,
			NEW.approve_status,
			NEW.approve_date,
			NEW.approve_notes,
			NEW.created_at,
			NEW.updated_at,
			NEW.due_date,
			NEW.done_date,
			NEW.control_from_id,
			NEW.control_to_id,
			NEW.title,
			NEW.notes,
			NEW.extra,
			NEW.archive_date,
			null
		);
				
		RETURN NEW;
	elsif (TG_OP = 'DELETE') then
		INSERT INTO control.operations_history (
			operation_id,
			case_id,
			class,
			type_id,
			author_id,
			updated_by_id,
			approve_from_id,
			approve_to_id,
			approve_status,
			approve_date,
			approve_notes,
			created_at,
			updated_at,
			due_date,
			done_date,
			control_from_id,
			control_to_id,
			title,
			notes,
			extra,
			archive_date,
			delete_date
		)
		VALUES(
			OLD.id,
			OLD.case_id,
			OLD.class,
			OLD.type_id,
			OLD.author_id,
			OLD.updated_by_id,
			OLD.approve_from_id,
			OLD.approve_to_id,
			OLD.approve_status,
			OLD.approve_date,
			OLD.approve_notes,
			OLD.created_at,
			OLD.updated_at,
			OLD.due_date,
			OLD.done_date,
			OLD.control_from_id,
			OLD.control_to_id,
			OLD.title,
			OLD.notes,
			OLD.extra,
			OLD.archive_date,
			CURRENT_TIMESTAMP
		);
		RETURN OLD;
	end if;
	
END;
$body$
LANGUAGE plpgsql;

CREATE TRIGGER operation_history_trigger
AFTER UPDATE OR DELETE ON control.operations_
FOR EACH ROW EXECUTE FUNCTION control.operation_history_trigger_func();