-- Требования
DROP VIEW IF EXISTS equity.claims_full_view CASCADE;
CREATE OR REPLACE VIEW equity.claims_full_view  AS
    ---------------------------------------------------------------------
    WITH raw_claims AS (
        SELECT
            c.id,
            c.object_id,
	   		to_jsonb(it) as "claimItemType",
	   		to_jsonb(so) as "claimSourceType",
	   
			so.priority,   
            MAX(so.priority) OVER (PARTITION BY c.object_id) as max_priority,
            c.claim_status,

            c.claim_registry_date,
            c.claim_registry_num,
            c.creditor_registry_num,
            c.basis,
            c.legal_act,
            c.change_basis,
            c.subject,
            c.sum_paid,
            c.sum_unpaid,
            c.sum_damages,

            c.claim_settlement_reason,
            c.claim_settlement_date,
            c.claim_exclusion_reason,
            c.claim_exclusion_date,

            c.creditor_name,
            c.creditor_documents,
            c.creditor_address,
            c.creditor_contacts,

            c.unit,
            c.section,
            c.floor,
            c.room_count,
            c.s,
            c.section_order,
            c.num_project,

            c.source,
            c.notes,
            c.identification_notes
        FROM equity.claims c
            LEFT JOIN (SELECT id, name, priority FROM equity.claim_source_types) so ON so.id = c.claim_source_type_id
            LEFT JOIN (SELECT id, name FROM equity.claim_item_types) it ON it.id = c.claim_item_type_id
    )
    SELECT 
        c.id,
        'claim' as "class",
        c.object_id as "objectId",
        c.max_priority = c.priority AND c.claim_status = 'active' as "isRelevant",
		c.claim_status as "claimStatus",
        c."claimItemType",
		c."claimSourceType",

        c.claim_registry_date as "claimRegistryDate",
        c.claim_registry_num as "claimRegistryNum",
        c.creditor_registry_num as "creditorRegistryNum",
        
        c.basis as "basis",
        c.legal_act as "legalAct",
        c.change_basis as "changeBasis",
        c.subject as "subject",
        c.sum_paid as "sumPaid",
        c.sum_unpaid as "sumUnpaid",
        c.sum_damages as "sumDamages",
        c.claim_settlement_reason as "claimSettlementReason",
        c.claim_settlement_date as "claimSettlementDate",
        c.claim_exclusion_reason as "claimExclusionReason",
        c.claim_exclusion_date as "claimExclusionDate",
        c.creditor_name as "creditorName",
        c.creditor_documents as "creditorDocuments",
        c.creditor_address as "creditorAddress",
        c.creditor_contacts as "creditorContacts",
        c.unit as "unit",
        c.section as "section",
        c.floor as "floor",
        c.room_count as "roomCount",
        c.s as "s",
        c.section_order as "sectionOrder",
        c.num_project as "numProject",
        c.source as "source",
        c.notes as "notes",
        c.identification_notes as "identificationNotes"

    FROM raw_claims c
        ORDER BY c.object_id, c.claim_status = 'active' DESC, c.priority DESC;
    ---------------------------------------------------------------------
ALTER TABLE equity.claims_full_view
    OWNER TO renovation_user;

-- Объекты
DROP VIEW IF EXISTS equity.objects_full_view CASCADE;
CREATE OR REPLACE VIEW equity.objects_full_view AS
    ---------------------------------------------------------------------
   WITH relevant_claims AS (
        SELECT 
            c."objectId",
            COUNT(*) as "claimsCount",
            SUM(c."sumUnpaid") as "sumUnpaid",
            MAX(c."claimRegistryDate") as "claimRegistryDate",
            STRING_AGG(DISTINCT c."creditorName", '; ') as creditor,
            STRING_AGG(DISTINCT c."numProject", '; ') as "numProject"
        FROM equity.claims_full_view c
        WHERE c."isRelevant" = true
        GROUP BY c."objectId"
    ), last_operation AS (
		SELECT 
			op.id,
			op.object_id as "objectId",
			op.type_id as "typeId",
			op.type_name as "typeName",
			op.has_double_sell as "hasDoubleSell",
			op.has_defects as "hasDefects",
			op.has_request as "hasRequest",
			op.needs_opinion as "needsOpinion",

            op.opinion_urgp as "opinionUrgp",
            op.opinion_upozh as "opinionUpozh",
            op.opinion_uork as "opinionUork",
            op.opinion_upozi as "opinionUpozi",
            op.documents_fio as "documentsFio",
            op.documents_date as "documentsDate",

            op.has_rg as "hasRg",

            -- op.opinion_urgp AND op.opinion_upozh AND op.opinion_uork as "opinionAll",

            op.documents_ok as "documentsOk",
            op.documents_problem as "documentsProblem",
            op.operations_fio as "operationsFio",

            op.id_problem as "idProblem",
			op.date
		FROM (
			SELECT 
				ROW_NUMBER() OVER(PARTITION BY o.object_id ORDER BY t.priority DESC, o.date DESC, o.id) as row_num,
				COUNT(*) FILTER (WHERE o.type_id = 8) OVER(PARTITION BY o.object_id) > 0 as has_double_sell,
				COUNT(*) FILTER (WHERE o.type_id = ANY(ARRAY[2,3,4])) OVER(PARTITION BY o.object_id) > 0 as has_defects,
				COUNT(*) FILTER (WHERE o.type_id = ANY(ARRAY[5,6,7,11,12,14,15,20])) OVER(PARTITION BY o.object_id) > 0 as has_request,
                COUNT(*) FILTER (WHERE o.type_id = ANY(ARRAY[6,11])) OVER(PARTITION BY o.object_id) > 0 as needs_opinion,

                COUNT(*) FILTER (WHERE o.type_id = ANY(ARRAY[21, 22])) OVER(PARTITION BY o.object_id) > 0 as has_rg,

                MAX(o.result) FILTER (WHERE o.type_id = ANY(ARRAY[7])) OVER(PARTITION BY o.object_id) as opinion_urgp,
                MAX(o.result) FILTER (WHERE o.type_id = ANY(ARRAY[14])) OVER(PARTITION BY o.object_id) as opinion_upozh,
                MAX(o.result) FILTER (WHERE o.type_id = ANY(ARRAY[15])) OVER(PARTITION BY o.object_id) as opinion_uork,
                MAX(o.result) FILTER (WHERE o.type_id = ANY(ARRAY[19])) OVER(PARTITION BY o.object_id) as opinion_upozi,

                MAX(o.date) FILTER (WHERE o.type_id = ANY(ARRAY[20])) OVER(PARTITION BY o.object_id) as documents_date,
                MAX(o.fio) FILTER (WHERE o.type_id = ANY(ARRAY[20])) OVER(PARTITION BY o.object_id) as documents_fio,
                COUNT(*) FILTER (WHERE o.type_id = ANY(ARRAY[20]) AND o.result = 'полный пакет') OVER(PARTITION BY o.object_id) > 0 as documents_ok,
                COUNT(*) FILTER (WHERE o.type_id = ANY(ARRAY[20]) AND o.result <> 'полный пакет') OVER(PARTITION BY o.object_id) > 0 as documents_problem,
                string_agg(o.fio, '; ') OVER(PARTITION BY o.object_id) as operations_fio,
                COUNT(*) FILTER (WHERE o.type_id = 9) OVER(PARTITION BY o.object_id) > 0 AND COUNT(*) FILTER (WHERE o.type_id = 10) OVER(PARTITION BY o.object_id) = 0 as id_problem,

				o.type_id,
				t.name as type_name,
				o.id,
				o.object_id,
				o.claim_id,
				COALESCE(o.date, o.created_at, NOW()) as date
			FROM equity.operations o
				LEFT JOIN equity.operation_types t ON t.id = o.type_id
		) op
		WHERE op.row_num = 1
	), buildings_full AS (
		SELECT
			b.id,
		    b.problems,
			c.id as "complexId",
			c.name as "complexName",
            c.transfer_date as "transferDate",
			-- c.developer,
            c.developer_short as "developerShort",
            b.is_done as "isDone",
			b.unom,
			b.cad_num as "cadNum",
			b.address_short as "addressShort"
			-- b.address_full as "addressFull",
			-- b.address_construction as "addressConstruction"
		FROM equity.buildings b
		LEFT JOIN equity.complexes c ON b.complex_id = c.id
	)
    SELECT
        o.id,
        o.is_identified as "isIdentified",
        'object' as "class",

        b.id as "buildingId",
        b."cadNum" as "buildingCadNum",
        b."developerShort",
        b."complexId",
        b."complexName",
        b."isDone" as "buildingIsDone",
        b."addressShort",

        ot.id as "objectTypeId",
        ot.name as "objectTypeName",
        s.id as "statusId",
        s.name as "statusName",
        
        o.cad_num as "cadNum", 
        o.num,
        o.npp,
        COALESCE(c."numProject", o.num) as "numProject",
        COALESCE(c."claimsCount", 0) as "claimsCount",
        c.creditor,
        CASE WHEN c."claimRegistryDate" IS NULL THEN 'Не в РТУС' WHEN c."claimRegistryDate" <= b."transferDate" THEN 'До передачи' ELSE 'После передачи' END as "claimTransfer",

        op.id as "lastOpId",
        op."typeId" as "lastOpTypeId",
        op."typeName" as "lastOpTypeName",
        op.date as "lastOpDate",

        ARRAY_REMOVE(
            ARRAY[
                    CASE WHEN o.is_identified IS DISTINCT FROM TRUE THEN 'unidentified' ELSE null END
                , CASE WHEN op."hasDoubleSell" THEN 'doublesell' ELSE null END
                , CASE WHEN op."hasDefects" THEN 'defects' ELSE null END
                , CASE WHEN (('claim-ap' = ANY(b.problems) AND o.object_type_id = 1) 
                    OR ('claim-mm' = ANY(b.problems) AND o.object_type_id = 2)) AND s.id = 4 
                    THEN 'potentialclaim' ELSE null END
                , CASE WHEN op."idProblem" THEN 'idproblem' ELSE null END
                , CASE WHEN c."sumUnpaid" > 0 THEN 'unpaid' ELSE null END
            ]
        , null) as problems,

        b.unom,
        o.unkv,
        o.rooms,
        o.floor,
        o.s_obsh as s,
        o.egrn_status as "egrnStatus",

        COALESCE(op."needsOpinion", false) as "needsOpinion",

        COALESCE(op."opinionUrgp", 'нет') as "opinionUrgp",
        COALESCE(op."opinionUpozh", 'нет') as "opinionUpozh",
        COALESCE(op."opinionUork", 'нет') as "opinionUork",
        COALESCE(op."opinionUpozi", 'нет') as "opinionUpozi",
        
        op."documentsFio",
        op."documentsDate",

        b."transferDate",
        c."claimRegistryDate",

        COALESCE(op."documentsOk", false) as "documentsOk",
        COALESCE(op."documentsProblem", false) as "documentsProblem",
        COALESCE(op."operationsFio", '') as "operationsFio"

    FROM equity.objects o
        LEFT JOIN (SELECT id, name FROM equity.object_types) ot ON ot.id = o.object_type_id
        LEFT JOIN buildings_full b ON o.building_id = b.id
        LEFT JOIN relevant_claims c ON c."objectId" = o.id
		LEFT JOIN last_operation op ON op."objectId" = o.id
		LEFT JOIN (SELECT id, name FROM equity.object_status_types) s ON s.id =
			CASE
				WHEN o.egrn_status = ANY(ARRAY['город Москва']) THEN 5
				WHEN o.egrn_status = ANY(ARRAY['Физ.лицо', 'Юр.лицо', 'Российская Федерация']) THEN 3
                WHEN op."hasRg" THEN 8
                WHEN op."hasRequest" THEN 7
				WHEN o.is_identified = FALSE THEN 6
				WHEN COALESCE(c."claimsCount", 0) = 0 THEN 4
				WHEN op."typeId" = 1 THEN 2
				ELSE 1
			END
    WHERE o.egrn_status <> 'Общее имущество мкд' AND (o.is_identified OR c."claimsCount" > 0)
    ORDER BY o.building_id, o.is_identified DESC, o.object_type_id, o.npp;
    ---------------------------------------------------------------------
ALTER TABLE equity.objects_full_view
    OWNER TO renovation_user;


-- Операции
DROP VIEW IF EXISTS equity.operations_full_view CASCADE;
CREATE OR REPLACE VIEW equity.operations_full_view AS
    ---------------------------------------------------------------------
 WITH user_info AS (SELECT id, fio, control_settings->>'department' as department FROM renovation.users),
      op_type_info AS (SELECT id, name, fullname, category, fields, priority FROM equity.operation_types)
    SELECT 
        o.id,
        'operation' as "class",
        o.object_id as "objectId",
        o.claim_id as "claimId",
        to_jsonb(t) as type,
        COALESCE(o.date, o.created_at, NOW()) as date,
        o.source,
        o.notes,
        o.number,
        o.result,
        o.fio,

        o.created_at as "createdAt",
        to_jsonb(u1) as "createdBy",
        o.updated_at as "updatedAt",
        to_jsonb(u2) as "updatedBy"

    FROM equity.operations o
        LEFT JOIN op_type_info t ON t.id = o.type_id
        LEFT JOIN user_info u1 ON u1.id = o.created_by_id
        LEFT JOIN user_info u2 ON u2.id = o.updated_by_id
    -- WHERE o.object_id = 35436
    ORDER BY o.object_id, o.date NULLS LAST, o.created_at NULLS LAST, o.id DESC;
    ---------------------------------------------------------------------
ALTER TABLE equity.operations_full_view
    OWNER TO renovation_user;


