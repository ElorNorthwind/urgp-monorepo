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
 --------------------------------------------------------------------------
    WITH buildings_full AS (
    SELECT
        b.id,
        c.id as "complexId",
        c.name as "complexName",
        c.transfer_date as "transferDate",
        c.district,
        c.old_developer as "oldDeveloper",
        c.developer_short as "developerShort",
        b.is_done as "isDone",
        b.unom,
        b.cad_num as "cadNum",
        b.address_short as "addressShort",
        b.address_construction_short as "addressConstructionShort"
    FROM equity.buildings b
    LEFT JOIN equity.complexes c ON b.complex_id = c.id
    )

    SELECT
        -----------------------------------ВЫРЕЗАТЬ ПРИ АПДЕЙТЕ БЭКА-----------------------------------
        CASE WHEN o.op_docs_id IS NOT NULL OR op_rg_prep_id IS NOT NULL THEN true ELSE false END as "needsOpinion", -- УДАЛИ ПРИ АПДЕЙТЕ
        CASE WHEN o.op_docs_result = 'полный пакет' THEN true ELSE false END as "documentsOk", -- УДАЛИ ПРИ АПДЕЙТЕ
        CASE WHEN o.op_docs_result IS NOT NULL AND o.op_docs_result <> 'полный пакет' THEN true ELSE false END as "documentsProblem", -- УДАЛИ ПРИ АПДЕЙТЕ
        -----------------------------------------------------------------------------------------------

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
        b."addressConstructionShort",

        ot.id as "objectTypeId",
        ot.name as "objectTypeName",
        o.status_id as "statusId",
        s.name as "statusName",

        o.cad_num as "cadNum", 
        o.num,
        o.npp,
        o.claim_apartment_number as "numProject",
        o.claim_count as "claimsCount",
        o.claim_creditors as creditor,
        
        CASE WHEN o.claim_first_date IS NULL THEN 'Не в РТУС' WHEN o.claim_first_date <= b."transferDate" THEN 'До передачи' ELSE 'После передачи' END as "claimTransfer",

        o.op_last_id as "lastOpId", 
        o.op_last_type_id as "lastOpTypeId",
        op.name as "lastOpTypeName",
        o.op_last_date as "lastOpDate",

        o.problems,

        b.unom,
        o.unkv,
        o.rooms,
        o.floor,
        o.s_obsh as s,
        o.egrn_status as "egrnStatus",

        o.op_urgp_date as "urgpDate",
        o.op_rg_prep_date as "rgPrepDate",
        o.op_rg_decision_date as "rgDecisionDate",
        o.op_rg_rejection_date as "rgRejectionDate",

        CASE 
            WHEN op_rg_prep_date IS NOT NULL AND op_rg_prep_date > COALESCE(op_rg_decision_date, '-infinity') AND op_rg_prep_date > COALESCE(op_rg_rejection_date, '-infinity') THEN 'prep' 
            WHEN op_rg_decision_date IS NOT NULL AND op_rg_decision_date > COALESCE(op_rg_rejection_date, '-infinity') THEN 'decision'
            WHEN op_rg_rejection_date IS NOT NULL THEN 'rejection'
            ELSE 'none'
        END as "rgStatus",

        COALESCE(o.op_urgp_result, 'нет') as "opinionUrgp",
        COALESCE(o.op_upozhs_result, 'нет') as "opinionUpozh",
        COALESCE(o.op_uork_result, 'нет') as "opinionUork",
        COALESCE(o.op_unpozi_result, 'нет') as "opinionUpozi",

        o.op_docs_fio as "documentsFio",
        o.op_docs_date as  "documentsDate",

        b."transferDate",
        b.district,
        b."oldDeveloper",
        o.claim_first_date as  "claimRegistryDate", -- Еше и не первую дату?

        CASE WHEN o.op_docs_result = 'полный пакет' THEN 'ok' WHEN o.op_docs_result IS NULL THEN 'none' ELSE 'problem' END as "documentsResult",
        
        COALESCE(o.op_all_fio, '') as "operationsFio",
        COALESCE(o.op_all_numbers, '') as "operationsNums",
        COALESCE(o.op_urgp_notes, '') as "urgpNotes"

    FROM equity.objects o
        LEFT JOIN (SELECT id, name FROM equity.object_types) ot ON ot.id = o.object_type_id
        LEFT JOIN buildings_full b ON o.building_id = b.id
        LEFT JOIN (SELECT id, name FROM equity.object_status_types) s ON s.id = o.status_id
        LEFT JOIN equity.operation_types op ON o.op_last_type_id = op.id
    WHERE o.egrn_status <> 'Общее имущество мкд' AND (o.is_identified OR o.claim_count > 0)
    ORDER BY o.building_id, o.is_identified DESC, o.object_type_id, o.npp;
    ---------------------------------------------------------------------
ALTER TABLE equity.objects_full_view
    OWNER TO renovation_user;


-- Операции
DROP VIEW IF EXISTS equity.operations_full_view CASCADE;
CREATE OR REPLACE VIEW equity.operations_full_view AS
    ---------------------------------------------------------------------
 WITH user_info AS (SELECT id, fio, control_settings->>'department' as department FROM renovation.users),
      op_type_info AS (SELECT id, name, fullname, category, fields, priority, is_important as "isImportant" FROM equity.operation_types)
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
    -- ORDER BY op.date::date DESC, (op.type->>'priority')::integer DESC, op."createdAt" DESC;
    -- ORDER BY o.object_id, o.date NULLS LAST, o.created_at NULLS LAST, o.id DESC;
    ORDER BY o.object_id, o.date::date NULLS LAST, t.priority, o.created_at NULLS LAST, o.id DESC;
    ---------------------------------------------------------------------
ALTER TABLE equity.operations_full_view
    OWNER TO renovation_user;


