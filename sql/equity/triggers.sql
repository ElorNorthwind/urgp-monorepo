-- ======================= OPERATIONS HISTORY TRIGGER ==============================
DROP TRIGGER IF EXISTS equity_operation_history_trigger ON equity.operations;

CREATE OR REPLACE FUNCTION equity.equity_operation_history_trigger_func()
RETURNS trigger AS $body$
BEGIN
	if (TG_OP = 'INSERT') then
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
	elseif (TG_OP = 'DELETE') then
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
FOR EACH ROW EXECUTE FUNCTION equity.equity_operation_history_trigger_func();





-- ===================== CLAIMS DENORMALIZATION TRIGGER =================================
DROP TRIGGER IF EXISTS equity_claims_denormalization_trigger ON equity.claims;

CREATE OR REPLACE function equity.update_claim_status(_object_id integer)
  RETURNS equity.objects
  security definer
  language sql
AS $$
  WITH claim_info AS (
    SELECT
        object_id,
        COUNT(*)::int as claim_count,
        MAX(claim_registry_date)::date as claim_date,
        MIN(first_registry_date)::date as first_claim_date,
        SUM(sum_unpaid) as sum_unpaid,
        TRANSLATE(STRING_AGG(DISTINCT creditor_name, '; '), ',', ';') as creditors,
        STRING_AGG(DISTINCT num_project, '; ') FILTER (WHERE num_project IS NOT NULL AND num_project <> '') as apartment_number,
        STRING_AGG(DISTINCT basis, '; ') as basis
    FROM (
        SELECT
            c.id,
            c.object_id,
            c.claim_status,
            c.claim_item_type_id,
            c.claim_source_type_id,
            t.priority,
            MAX(t.priority) OVER (PARTITION BY c.object_id) as max_priority,
            c.num_project,
            c.claim_registry_date,
            MIN(c.claim_registry_date) OVER (PARTITION BY c.object_id, c.creditor_registry_num) as first_registry_date,
            c.sum_unpaid,
            c.creditor_name,
            c.basis
        FROM equity.claims c
        LEFT JOIN equity.claim_source_types t ON c.claim_source_type_id = t.id
        WHERE c.object_id = _object_id
    ) cl
    WHERE claim_status = 'active' 
      AND priority = max_priority
    GROUP BY object_id
  )
  UPDATE equity.objects o
  SET 
    claim_count = COALESCE(c.claim_count, 0),
    claim_first_date = c.first_claim_date,
    claim_sum_unpaid = COALESCE(c.sum_unpaid, 0),
    claim_creditors = c.creditors,
    claim_basis = c.basis,
    claim_apartment_number = c.apartment_number
  FROM claim_info c
  WHERE o.id = _object_id
  RETURNING o.*;
$$;

CREATE OR REPLACE FUNCTION equity.update_claim_status_trigger_func()
RETURNS trigger AS $body$
BEGIN
	if (TG_OP = 'INSERT') then
		PERFORM equity.update_claim_status(NEW.object_id);
		RETURN NEW;
	elseif (TG_OP = 'UPDATE') then
		PERFORM equity.update_claim_status(NEW.object_id);
        if (OLD.object_id != NEW.object_id) then
            PERFORM equity.update_claim_status(OLD.object_id);
        end if;
		RETURN NEW;
	elseif (TG_OP = 'DELETE') then
		PERFORM equity.update_claim_status(OLD.object_id);
		RETURN OLD;
	end if;
END;
$body$
LANGUAGE plpgsql;

CREATE TRIGGER equity_claims_denormalization_trigger
AFTER INSERT OR UPDATE OR DELETE ON equity.claims
FOR EACH ROW EXECUTE FUNCTION equity.update_claim_status_trigger_func();




-- ===================== OPERATIONS DENORMALIZATION TRIGGER =================================
DROP TRIGGER IF EXISTS equity_operations_denormalization_trigger ON equity.claims;

CREATE OR REPLACE function equity.update_operation_status(_object_id integer)
  RETURNS equity.objects
  security definer
  language sql
AS $$
    WITH last_ops AS (
        SELECT 
        DISTINCT ON (object_id, type_id)
            id,
            object_id,
            COALESCE(o.date, o.created_at) as date,
            created_by_id,
            type_id,
            notes,
            number,
            result, 
            fio
        FROM equity.operations o
        ORDER BY o.object_id, o.type_id, o.date DESC, o.created_at DESC
    ), very_last_op_info AS (
        SELECT 
        DISTINCT ON (object_id)
            id,
            type_id,
            object_id,
            COALESCE(o.date, o.created_at) as date
        FROM equity.operations o
        ORDER BY o.object_id, o.date DESC, o.created_at DESC
    ), last_op_info AS (
        SELECT 
            object_id,

            MAX(id) FILTER (WHERE type_id = 20) as docs_id,
            MAX(date) FILTER (WHERE type_id = 20) as docs_date,
            MAX(notes) FILTER (WHERE type_id = 20) as docs_notes,
            MAX(fio) FILTER (WHERE type_id = 20) as docs_fio,
            MAX(result) FILTER (WHERE type_id = 20) as docs_result,
            MAX(created_by_id) FILTER (WHERE type_id = 20) as docs_author,

            MAX(id) FILTER (WHERE type_id = 7) as urgp_id,
            MAX(date) FILTER (WHERE type_id = 7) as urgp_date,
            MAX(notes) FILTER (WHERE type_id = 7) as urgp_notes,
            MAX(fio) FILTER (WHERE type_id = 7) as urgp_fio,
            MAX(result) FILTER (WHERE type_id = 7) as urgp_result,
            MAX(created_by_id) FILTER (WHERE type_id = 7) as urgp_author,

            MAX(id) FILTER (WHERE type_id = 14) as upozhs_id,
            MAX(date) FILTER (WHERE type_id = 14) as upozhs_date,
            MAX(notes) FILTER (WHERE type_id = 14) as upozhs_notes,
            MAX(fio) FILTER (WHERE type_id = 14) as upozhs_fio,
            MAX(result) FILTER (WHERE type_id = 14) as upozhs_result,
            MAX(created_by_id) FILTER (WHERE type_id = 14) as upozhs_author,

            MAX(id) FILTER (WHERE type_id = 15) as uork_id,
            MAX(date) FILTER (WHERE type_id = 15) as uork_date,
            MAX(notes) FILTER (WHERE type_id = 15) as uork_notes,
            MAX(fio) FILTER (WHERE type_id = 15) as uork_fio,
            MAX(result) FILTER (WHERE type_id = 15) as uork_result,
            MAX(created_by_id) FILTER (WHERE type_id = 15) as uork_author,

            MAX(id) FILTER (WHERE type_id = 19) as unpozi_id,
            MAX(date) FILTER (WHERE type_id = 19) as unpozi_date,
            MAX(notes) FILTER (WHERE type_id = 19) as unpozi_notes,
            MAX(fio) FILTER (WHERE type_id = 19) as unpozi_fio,
            MAX(result) FILTER (WHERE type_id = 19) as unpozi_result,
            MAX(created_by_id) FILTER (WHERE type_id = 19) as unpozi_author,

            MAX(id) FILTER (WHERE type_id = 21) as rg_prep_id,
            MAX(date) FILTER (WHERE type_id = 21) as rg_prep_date,
            MAX(notes) FILTER (WHERE type_id = 21) as rg_prep_notes,
            MAX(fio) FILTER (WHERE type_id = 21) as rg_prep_fio,

            MAX(id) FILTER (WHERE type_id = 22) as rg_decision_id,
            MAX(date) FILTER (WHERE type_id = 22) as rg_decision_date,
            MAX(notes) FILTER (WHERE type_id = 22) as rg_decision_notes,
            MAX(number) FILTER (WHERE type_id = 22) as rg_decision_number,
            MAX(result) FILTER (WHERE type_id = 22) as rg_decision_result,
            MAX(fio) FILTER (WHERE type_id = 22) as rg_decision_fio,

            MAX(id) FILTER (WHERE type_id = 23) as rg_rejection_id,
            MAX(date) FILTER (WHERE type_id = 23) as rg_rejection_date,
            MAX(notes) FILTER (WHERE type_id = 23) as rg_rejection_notes,
            MAX(result) FILTER (WHERE type_id = 23) as rg_rejection_result,
            MAX(fio) FILTER (WHERE type_id = 23) as rg_rejection_fio,

            MAX(id) FILTER (WHERE type_id = ANY(ARRAY[2,3,4])) as defects_id,
            MAX(date) FILTER (WHERE type_id = ANY(ARRAY[2,3,4])) as defects_date,
            MAX(notes) FILTER (WHERE type_id = ANY(ARRAY[2,3,4])) as defects_notes,

            MAX(id) FILTER (WHERE type_id = 1) as act_id,
            MAX(date) FILTER (WHERE type_id = 1) as act_date,
            MAX(notes) FILTER (WHERE type_id = 1) as act_notes,

            MAX(id) FILTER (WHERE type_id = 16) as keys_id,
            MAX(date) FILTER (WHERE type_id = 16) as keys_date,
            MAX(notes) FILTER (WHERE type_id = 16) as keys_notes,

            CASE WHEN MAX(date) FILTER (WHERE type_id = ANY(ARRAY[18])) > MAX(date) FILTER (WHERE type_id = ANY(ARRAY[8])) THEN null ELSE MAX(id) FILTER (WHERE type_id = ANY(ARRAY[8])) END as doublesell_id,
            CASE WHEN MAX(date) FILTER (WHERE type_id = ANY(ARRAY[18])) > MAX(date) FILTER (WHERE type_id = ANY(ARRAY[8])) THEN null ELSE MAX(date) FILTER (WHERE type_id = ANY(ARRAY[8])) END as doublesell_date,
            CASE WHEN MAX(date) FILTER (WHERE type_id = ANY(ARRAY[18])) > MAX(date) FILTER (WHERE type_id = ANY(ARRAY[8])) THEN null ELSE MAX(notes) FILTER (WHERE type_id = ANY(ARRAY[8])) END as doublesell_notes,

            CASE WHEN MAX(date) FILTER (WHERE type_id = ANY(ARRAY[10])) > MAX(date) FILTER (WHERE type_id = ANY(ARRAY[9])) THEN null ELSE MAX(id) FILTER (WHERE type_id = ANY(ARRAY[9])) END as identification_id,
            CASE WHEN MAX(date) FILTER (WHERE type_id = ANY(ARRAY[10])) > MAX(date) FILTER (WHERE type_id = ANY(ARRAY[9])) THEN null ELSE MAX(date) FILTER (WHERE type_id = ANY(ARRAY[9])) END as identification_date,
            CASE WHEN MAX(date) FILTER (WHERE type_id = ANY(ARRAY[10])) > MAX(date) FILTER (WHERE type_id = ANY(ARRAY[9])) THEN null ELSE MAX(notes) FILTER (WHERE type_id = ANY(ARRAY[9])) END as identification_notes

        FROM last_ops
        WHERE object_id = _object_id
        GROUP BY object_id
    ), op_totals AS (
        SELECT 
            object_id,
            string_agg(DISTINCT notes, '; ') FILTER (WHERE type_id = 17 AND notes IS NOT NULL AND notes <> '') as all_notes,
            string_agg(DISTINCT fio, '; ') FILTER (WHERE fio IS NOT NULL AND fio <> '') as all_fio,
            string_agg(DISTINCT number, '; ') FILTER (WHERE number IS NOT NULL AND number <> '') as all_numbers
        FROM equity.operations
        WHERE object_id = _object_id
        GROUP BY object_id
    )
    UPDATE equity.objects ob
    SET
        op_all_notes = op.all_notes,
        op_all_fio = op.all_fio,
        op_all_numbers = op.all_numbers,

        op_last_id = op.last_id,
        op_last_type_id = op.last_type_id,
        op_last_date = op.last_date,

        op_docs_id = op.docs_id,
        op_docs_date = op.docs_date,
        op_docs_notes = op.docs_notes,
        op_docs_fio = op.docs_fio,
        op_docs_result = op.docs_result,
        op_docs_author = op.docs_author,

        op_urgp_id = op.urgp_id,
        op_urgp_date = op.urgp_date,
        op_urgp_notes = op.urgp_notes,
        op_urgp_fio = op.urgp_fio,
        op_urgp_result = op.urgp_result,
        op_urgp_author = op.urgp_author,

        op_upozhs_id = op.upozhs_id,
        op_upozhs_date = op.upozhs_date,
        op_upozhs_notes = op.upozhs_notes,
        op_upozhs_fio = op.upozhs_fio,
        op_upozhs_result = op.upozhs_result,
        op_upozhs_author = op.upozhs_author,

        op_uork_id = op.uork_id,
        op_uork_date = op.uork_date,
        op_uork_notes = op.uork_notes,
        op_uork_fio = op.uork_fio,
        op_uork_result = op.uork_result,
        op_uork_author = op.uork_author,

        op_unpozi_id = op.unpozi_id,
        op_unpozi_date = op.unpozi_date,
        op_unpozi_notes = op.unpozi_notes,
        op_unpozi_fio = op.unpozi_fio,
        op_unpozi_result = op.unpozi_result,
        op_unpozi_author = op.unpozi_author,

        op_rg_prep_id = op.rg_prep_id,
        op_rg_prep_date = op.rg_prep_date,
        op_rg_prep_notes = op.rg_prep_notes,
        op_rg_prep_fio = op.rg_prep_fio,

        op_rg_decision_id = op.rg_decision_id,
        op_rg_decision_date = op.rg_decision_date,
        op_rg_decision_notes = op.rg_decision_notes,
        op_rg_decision_number = op.rg_decision_number,
        op_rg_decision_result = op.rg_decision_result,
        op_rg_decision_fio = op.rg_decision_fio,

        op_rg_rejection_id = op.rg_rejection_id,
        op_rg_rejection_date = op.rg_rejection_date,
        op_rg_rejection_notes = op.rg_rejection_notes,
        op_rg_rejection_result = op.rg_rejection_result,
        op_rg_rejection_fio = op.rg_rejection_fio,

        op_defects_id = op.defects_id,
        op_defects_date = op.defects_date,
        op_defects_notes = op.defects_notes,

        op_act_id = op.act_id,
        op_act_date = op.act_date,
        op_act_notes = op.act_notes,

        op_keys_id = op.keys_id,
        op_keys_date = op.keys_date,
        op_keys_notes = op.keys_notes,

        op_doublesell_id = op.doublesell_id,
        op_doublesell_date = op.doublesell_date,
        op_doublesell_notes = op.doublesell_notes,
        
        op_identification_id = op.identification_id,
        op_identification_date = op.identification_date,
        op_identification_notes = op.identification_notes
    FROM (
        SELECT ot.all_notes, ot.all_fio, ot.all_numbers, 
		vop.id as last_id, vop.type_id as last_type_id, vop.date as last_date,
		op.*
        FROM last_op_info op
        LEFT JOIN op_totals ot ON op.object_id = ot.object_id
        LEFT JOIN very_last_op_info vop ON op.object_id = vop.object_id
    ) op
    WHERE  ob.id = _object_id 
    AND ob.id = op.object_id
    RETURNING ob.*;
$$;

CREATE OR REPLACE FUNCTION equity.update_operation_status_trigger_func()
RETURNS trigger AS $body$
BEGIN
	if (TG_OP = 'INSERT') then
		PERFORM equity.update_operation_status(NEW.object_id);
		RETURN NEW;
	elseif (TG_OP = 'UPDATE') then
		PERFORM equity.update_operation_status(NEW.object_id);
        if (OLD.object_id != NEW.object_id) then
            PERFORM equity.update_operation_status(OLD.object_id);
        end if;
		RETURN NEW;
	elseif (TG_OP = 'DELETE') then
		PERFORM equity.update_operation_status(OLD.object_id);
		RETURN OLD;
	end if;
END;
$body$
LANGUAGE plpgsql;

CREATE TRIGGER equity_operations_denormalization_trigger
AFTER INSERT OR UPDATE OR DELETE ON equity.operations
FOR EACH ROW EXECUTE FUNCTION equity.update_operation_status_trigger_func();






-- ===================== BUILDING PROBLEMS DENORMALIZATION TRIGGER =================================
DROP TRIGGER IF EXISTS equity_building_problems_denormalization_trigger ON equity.building;
 CREATE OR REPLACE function equity.update_building_problems(_building_id integer)
  RETURNS equity.objects
  security definer
  language sql
AS $$
	UPDATE equity.objects o
		SET building_problems = b.problems
	FROM equity.buildings b
	WHERE o.building_id = _building_id 
	  AND b.id = _building_id
	RETURNING o.*;
$$;

CREATE OR REPLACE FUNCTION equity.update_building_problems_trigger_func()
RETURNS trigger AS $body$
BEGIN
    PERFORM equity.update_building_problems(NEW.id);
    RETURN NEW;
END;
$body$
LANGUAGE plpgsql;

CREATE TRIGGER equity_building_problems_denormalization_trigger
AFTER UPDATE OF problems ON equity.buildings
FOR EACH ROW EXECUTE FUNCTION equity.update_building_problems_trigger_func();