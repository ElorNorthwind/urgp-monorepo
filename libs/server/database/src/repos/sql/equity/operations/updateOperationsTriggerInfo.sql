
-- UPDATE OPERATIONS DENORMALIZATION

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
        GROUP BY object_id
    ), op_totals AS (
        SELECT 
            object_id,
            string_agg(DISTINCT notes, '; ') FILTER (WHERE type_id = 17 AND notes IS NOT NULL AND notes <> '') as all_notes,
            string_agg(DISTINCT fio, '; ') FILTER (WHERE fio IS NOT NULL AND fio <> '') as all_fio,
            string_agg(DISTINCT number, '; ') FILTER (WHERE number IS NOT NULL AND number <> '') as all_numbers
        FROM equity.operations
        GROUP BY object_id
    )
    UPDATE equity.objects ob
    SET
        op_all_notes = op.all_notes,
        op_all_fio = op.all_fio,
        op_all_numbers = op.all_numbers,

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
        SELECT ot.all_notes, ot.all_fio, ot.all_numbers, op.*
        FROM last_op_info op
        LEFT JOIN op_totals ot ON op.object_id = ot.object_id
    ) op
    WHERE ob.id = op.object_id;