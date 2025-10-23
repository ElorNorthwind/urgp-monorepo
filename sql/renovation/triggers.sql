DROP TRIGGER IF EXISTS litigation_hearing_trigger ON renovation.apartment_litigation_hearings;
DROP TRIGGER IF EXISTS litigation_hearing_trigger_insert ON renovation.apartment_litigation_hearings;
DROP TRIGGER IF EXISTS litigation_hearing_trigger_delete ON renovation.apartment_litigation_hearings;

DROP TRIGGER IF EXISTS litigation_errants_trigger ON renovation.apartment_litigation_errants;
DROP TRIGGER IF EXISTS litigation_errants_trigger_insert ON renovation.apartment_litigation_errants;
DROP TRIGGER IF EXISTS litigation_errants_trigger_delete ON renovation.apartment_litigation_errants;

DROP TRIGGER IF EXISTS litigations_trigger ON renovation.apartment_litigations_temp;
DROP TRIGGER IF EXISTS litigations_trigger_insert ON renovation.apartment_litigations_temp;
DROP TRIGGER IF EXISTS litigations_trigger_delete ON renovation.apartment_litigations_temp;

DROP TRIGGER IF EXISTS apartment_connections_trigger ON renovation.apartment_connections;
DROP TRIGGER IF EXISTS apartment_connections_trigger_insert ON renovation.apartment_connections;
DROP TRIGGER IF EXISTS apartment_connections_trigger_delete ON renovation.apartment_connections;

DROP TRIGGER IF EXISTS apartments_old_trigger ON renovation.apartments_old_temp;
DROP TRIGGER IF EXISTS apartments_old_trigger_insert ON renovation.apartments_old_temp;
DROP TRIGGER IF EXISTS apartments_old_trigger_delete ON renovation.apartments_old_temp;

DROP TRIGGER IF EXISTS new_aparts_trigger ON renovation.apartments_new;
DROP TRIGGER IF EXISTS new_aparts_trigger_isert ON renovation.apartments_new;
DROP TRIGGER IF EXISTS new_aparts_trigger_delete ON renovation.apartments_new;

DROP TRIGGER IF EXISTS dates_buildings_old_trigger ON renovation.dates_buildings_old;
DROP TRIGGER IF EXISTS dates_buildings_old_trigger_insert ON renovation.dates_buildings_old;
DROP TRIGGER IF EXISTS dates_buildings_old_trigger_delete ON renovation.dates_buildings_old;

DROP TRIGGER IF EXISTS dates_buildings_new_trigger ON renovation.dates_buildings_new;
DROP TRIGGER IF EXISTS dates_buildings_new_trigger_insert ON renovation.dates_buildings_new;
DROP TRIGGER IF EXISTS dates_buildings_new_trigger_delete ON renovation.dates_buildings_new;

DROP TRIGGER IF EXISTS messages_trigger        ON renovation.messages;
DROP TRIGGER IF EXISTS messages_trigger_insert ON renovation.messages;
DROP TRIGGER IF EXISTS messages_trigger_delete ON renovation.messages;


-- Функция обновления классификатора по списку ID старой квартиры
CREATE OR REPLACE FUNCTION renovation.update_classificator(apartment_ids integer[])
RETURNS void AS 
$BODY$
BEGIN

    WITH building_dates AS (
        SELECT
            building_id,
            max(control_date) FILTER (WHERE date_type = 1) AS resetlement_start
        FROM renovation.dates_buildings_old
        GROUP BY building_id
    ), manual_stages AS (
        SELECT 
            apartment_id, 
            stage_id, 
            stage_date
        FROM(
            SELECT 
                apartment_id,
                stage_id,
                stage_date,
                rank() OVER(PARTITION BY apartment_id ORDER BY priority DESC, stage_date DESC) as rank
            FROM (
                SELECT 
                    m.apartment_id, 
                    (message_payload->-1->>'stageId')::integer as stage_id, 
                    (message_payload->-1->>'docDate')::date as stage_date, 
                    s.group_name, 
                    s.priority, 
                    rank() OVER (PARTITION BY m.apartment_id, s.group_name ORDER BY s.priority DESC, (m.message_payload->-1->>'docDate')::date DESC, m.id) as rank,
                    BOOL_OR(s.is_cancelling IS NOT DISTINCT FROM True) OVER (PARTITION BY m.apartment_id, s.group_name) as cancelled
                FROM renovation.messages m
                LEFT JOIN renovation.apartment_stages s ON s.id = (message_payload->-1->>'stageId')::integer
                WHERE message_type = 'stage' AND s.id IS NOT NULL 
                  AND (message_payload->-1->>'deleted')::boolean IS DISTINCT FROM true 
                  AND (message_payload->-1->>'approveStatus')::text IS NOT DISTINCT FROM 'approved'
            ) s
            WHERE rank = 1 AND cancelled IS DISTINCT FROM True
        ) st
        WHERE st.rank = 1
    ), dates_aggeration AS (
        SELECT 
            a.id,
            -- не очень ок, это лишние агрегации, но данные нужны для классификатора. feels batman
            MAX(a.building_id) as building_id,
            MAX(a.custody_date) as custody_date,
            MAX(a.old_apart_status) as old_apart_status,
            MAX(a.requirement) as requirement,
            MAX(a.fio) as fio,
            MAX(a.notes) as notes,
            MAX(a.kpu_close_reason) as kpu_close_reason,
            MAX(b.resetlement_start) as resetlement_start,
            -- дальше уже ок
            MIN(h.hearing_date) as first_hearing,
            MAX(h.act_date) FILTER (WHERE h.subject_of_proceedings = 'Основное дело' AND h.hearing_result_class = 'В пользу ДГИ' AND LOWER(l.case_result) NOT LIKE '%слушается в%') AS last_act_won, 
            MAX(h.act_date) FILTER (WHERE h.subject_of_proceedings = 'Основное дело' AND h.hearing_result_class = 'Не в пользу ДГИ' AND LOWER(l.case_result) NOT LIKE '%слушается в%') AS last_act_lost, 
            BOOL_OR(l.fssp_status = ANY(ARRAY['ИСПОЛНЕНО', 'ОТМЕНЕНО']) AND l.fssp_execution_status = 'Окончено' AND (LOWER(l.case_result) LIKE '%удовлетворены требования%дги%' OR LOWER(l.fssp_subject_of_proceedings) = ANY(ARRAY['переселение', 'выселение']))) as is_executed, -- хотя бы одно ИП закрыто
            BOOL_OR(ca.need_no_execution) as need_no_execution,  -- хотя бы одно дело не требует исполнения
            MAX(l.fssp_institute_date) AS last_fssp_institute_date,
            COALESCE(MIN(LEAST(l.claim_date, l.claim_submission_date, h.hearing_date, e.errant_date)),
                    MIN(c.contract_creation_date) FILTER (WHERE (LOWER(c.inspection_response) LIKE '%судебное дело%'::text OR LOWER(c.order_reason) LIKE '%по суду%') AND c.status_prio > 0)
            ) as litigation_start_date,
            BOOL_OR(ca.dgi_role = 'ответчик') as litigation_people_claim,
            MIN(LEAST(l.claim_submission_date, h.hearing_date)) as claim_submission_date,
            COALESCE(MAX(COALESCE(l.fssp_list_date, l.fssp_list_send_date)), 
                    MIN(e.errant_date) FILTER (WHERE e.errant_type LIKE ANY (ARRAY['%05.14.%', '%05.15.%']))
            ) as litigation_fssp_list_date,
            BOOL_OR(c.order_reason = 'Московский фонд реновации жилой застройки'::text) as is_mfr, -- Хотя бы один ордер за МФР
            BOOL_OR(c.order_reason = 'Реновация. Моссоцгарантия Рента'::text) as is_msg_rent, -- Хотя бы один ордер за Рентой Моссоцганартии
            min(c.order_date) as order_date, 
            min(c.inspection_date) as first_inspection_date, 
            max(c.inspection_date) as inspection_date, 
            max(c.inspection_response_date) FILTER (WHERE LOWER(c.inspection_response) LIKE '%согл%') as accept_date, 
            max(c.inspection_response_date) FILTER (WHERE LOWER(c.inspection_response) LIKE '%отказ%') as reject_date, 
            max(c.rd_date) as rd_date, 
            max(c.contract_creation_date) as contract_project_date,
            max(c.contract_notification_date) as contract_notification_date,
            max(c.contract_prelimenary_signing_date) as contract_prelimenary_signing_date,
            max(c.contract_date) FILTER (WHERE LOWER(c.contract_status) <> 'проект договора') as contract_date,
            bool_or(a.new_aparts @> '[{"defects": true}]') as has_defects
        FROM renovation.apartments_old_temp a
        LEFT JOIN renovation.apartment_litigation_connections co ON co.old_apart_id = a.id
        LEFT JOIN renovation.apartment_litigations_temp l ON l.id = co.litigation_id
        LEFT JOIN renovation.apartment_litigation_hearings h ON h.litigation_id = co.litigation_id
        LEFT JOIN renovation.apartment_litigation_errants e ON e.litigation_id = co.litigation_id
        LEFT JOIN renovation.apartment_connections c ON c.old_apart_id = a.id
        LEFT JOIN renovation.case_categories ca ON ca.id = l.case_category_id
        LEFT JOIN building_dates b ON b.building_id = a.building_id
        GROUP BY a.id   
    ), dates_prepared AS (
        SELECT 
            da.id,
            da.building_id,
            da.custody_date,
            da.old_apart_status,
            da.requirement,
            da.fio,
            da.notes,
            da.kpu_close_reason,
            da.resetlement_start,
            da.last_act_won,
            da.last_act_lost,
            da.is_executed,
            CASE WHEN da.last_act_won IS NOT NULL THEN da.need_no_execution ELSE Null END as need_no_execution,
            CASE WHEN da.last_act_won IS NOT NULL THEN da.last_fssp_institute_date ELSE Null END as last_fssp_institute_date,
            da.litigation_people_claim,
            da.claim_submission_date,
            CASE WHEN da.last_act_won IS NOT NULL THEN da.litigation_fssp_list_date ELSE Null END as litigation_fssp_list_date,
            da.is_mfr,
            da.is_msg_rent,
            da.litigation_start_date,
            da.order_date,
            da.accept_date,
            da.reject_date,
            da.rd_date,
            da.contract_project_date,
            da.contract_notification_date,
            da.contract_prelimenary_signing_date,
            da.contract_date,
            da.has_defects,
            CASE WHEN da.reject_date IS NULL OR da.reject_date >= da.first_inspection_date THEN da.first_inspection_date ELSE Null END as inspection_date,
            CASE WHEN da.reject_date < da.inspection_date THEN da.inspection_date ELSE Null END as reinspection_date,
            CASE WHEN da.last_act_lost < da.inspection_date THEN da.inspection_date ELSE Null END as lost_inspection_date,
            CASE WHEN da.last_act_lost < da.accept_date THEN da.accept_date ELSE Null END as lost_accept_date,
            CASE WHEN da.last_act_lost < da.rd_date THEN da.rd_date ELSE Null END as lost_rd_date,
            CASE WHEN da.last_act_lost < da.contract_project_date THEN da.contract_project_date ELSE Null END as lost_contract_project_date,
            CASE WHEN da.last_act_lost < da.contract_prelimenary_signing_date THEN da.contract_prelimenary_signing_date ELSE Null END as lost_contract_prelimenary_signing_date,
            CASE WHEN da.last_act_won < da.rd_date THEN da.rd_date ELSE Null END as won_rd_date,
            CASE WHEN da.last_act_won < da.contract_project_date THEN da.contract_project_date ELSE Null END as won_contract_project_date,
            -- ручной классификатор
            ms.stage_id as manual_stage_id,
            ms.stage_date as manual_stage_date,
            -- чисто для даты этапов, которые считаются по флагам
            CASE WHEN LOWER(da.old_apart_status) LIKE ANY (ARRAY['%аренда%', '%федеральная%', '%служебн%', '%общежит%']) THEN da.order_date ELSE Null END as problem_date,
            CASE WHEN da.is_mfr = true THEN da.order_date ELSE Null END as mfr_date,
            CASE WHEN da.custody_date IS NOT Null THEN da.custody_date WHEN LOWER(da.requirement) LIKE '%не требуется%' OR LOWER(da.fio) LIKE '%свободн%' OR da.notes = 'ДГИ. Свободна' OR (da.kpu_close_reason IS NOT NULL AND da.kpu_close_reason <> 'п.2 выдан ордер по данной постановке') THEN da.order_date ELSE Null END as free_date,
            CASE WHEN da.is_executed = true OR (da.last_act_won IS NOT NULL AND da.need_no_execution = true) THEN COALESCE(da.litigation_fssp_list_date, da.last_fssp_institute_date, da.last_act_won, da.order_date) ELSE Null END as execution_date,
            CASE WHEN da.is_msg_rent = true THEN da.order_date ELSE Null END as msg_rent_date
        FROM dates_aggeration da
        LEFT JOIN manual_stages ms ON ms.apartment_id = da.id
    ), classified AS (
        SELECT 
            d.id,
            d.building_id,
            jsonb_build_object(
                'resettlementStart', jsonb_build_object('date', d.resetlement_start, 'days', 0, 'id', 0),
                'free', jsonb_build_object('date', d.custody_date, 'days', d.custody_date - d.resetlement_start, 'id', 1), 
                'problem', jsonb_build_object('date', d.problem_date, 'days', d.problem_date - d.resetlement_start, 'id', 2),
                'order', jsonb_build_object('date', d.order_date, 'days', d.order_date - d.resetlement_start, 'id', 3),
                'inspection', jsonb_build_object('date', d.inspection_date, 'days', d.inspection_date - d.resetlement_start, 'id', 4),
                'reject', jsonb_build_object('date', d.reject_date, 'days', d.reject_date - d.resetlement_start, 'id', 5),
                'reinspection', jsonb_build_object('date', d.reinspection_date, 'days', d.reinspection_date - d.resetlement_start, 'id', 6),
                'accept', jsonb_build_object('date', d.accept_date, 'days', d.accept_date - d.resetlement_start, 'id', 7),
                'rd', jsonb_build_object('date', d.rd_date, 'days', d.rd_date - d.resetlement_start, 'id', 8),
                'contractProject', jsonb_build_object('date', d.contract_project_date, 'days', d.contract_project_date - d.resetlement_start, 'id', 9),
                'contractNotification', jsonb_build_object('date', d.contract_notification_date, 'days', d.contract_notification_date - d.resetlement_start, 'id', 10),
                'contractPrelimenarySigning', jsonb_build_object('date', d.contract_prelimenary_signing_date, 'days', d.contract_prelimenary_signing_date - d.resetlement_start, 'id', 11),
                'mfr', jsonb_build_object('date', d.mfr_date, 'days', d.mfr_date - d.resetlement_start, 'id', 12),
                'claimStart', jsonb_build_object('date', d.litigation_start_date, 'days', d.litigation_start_date - d.resetlement_start, 'id', 13),
                'claimSubmit', jsonb_build_object('date', d.claim_submission_date, 'days', d.claim_submission_date - d.resetlement_start, 'id', 14),
                'claimWon', jsonb_build_object('date', d.last_act_won, 'days', d.last_act_won - d.resetlement_start, 'id', 15),
                'claimLost', jsonb_build_object('date', d.last_act_lost, 'days', d.last_act_lost - d.resetlement_start, 'id', 16),
                'lostInspection', jsonb_build_object('date', d.lost_inspection_date, 'days', d.lost_inspection_date - d.resetlement_start, 'id', 17),
                'lostAccept', jsonb_build_object('date', d.lost_accept_date, 'days', d.lost_accept_date - d.resetlement_start, 'id', 18),
                'lostRd', jsonb_build_object('date', d.lost_rd_date, 'days', d.lost_rd_date - d.resetlement_start, 'id', 19),
                'lostContractProject', jsonb_build_object('date', d.lost_contract_project_date, 'days', d.lost_contract_project_date - d.resetlement_start, 'id', 20),
                'lostContractPrelimenarySigning', jsonb_build_object('date', d.lost_contract_prelimenary_signing_date, 'days', d.lost_contract_prelimenary_signing_date - d.resetlement_start, 'id', 21),
                'fsspList', jsonb_build_object('date', d.litigation_fssp_list_date, 'days', d.litigation_fssp_list_date - d.resetlement_start, 'id', 22),
                'fsspInstitute', jsonb_build_object('date', d.last_fssp_institute_date, 'days', d.last_fssp_institute_date - d.resetlement_start, 'id', 23),
                'wonRd', jsonb_build_object('date', d.won_rd_date, 'days', d.won_rd_date - d.resetlement_start, 'id', 24),
                'wonContractProject', jsonb_build_object('date', d.won_contract_project_date, 'days', d.won_contract_project_date - d.resetlement_start, 'id', 25),
                'contract', jsonb_build_object('date', d.contract_date, 'days', d.contract_date - d.resetlement_start, 'id', 26),
                'execution', jsonb_build_object('date', d.execution_date, 'days', d.execution_date - d.resetlement_start, 'id', 27),
                'msgRelocation', jsonb_build_object('date', d.msg_rent_date, 'days', d.msg_rent_date - d.resetlement_start, 'id', 28),
                'manual', jsonb_build_object('date', d.manual_stage_date, 'days', d.manual_stage_date - d.resetlement_start, 'id', d.manual_stage_id)
            ) as stages_dates,
            s.id as stage_id,
            s.name as stage,
            s.next_action_text as next_action,
            s.camel_case_key,
            s.expected_done_days,
            array_remove(array[
                    CASE WHEN d.is_mfr = true THEN 'МФР' ELSE null END,
                    CASE WHEN LOWER(d.old_apart_status) LIKE ANY (ARRAY['%аренда%', '%федеральная%', '%служебн%', '%общежит%']) THEN 'Проблемная' ELSE null END,
                    CASE WHEN d.litigation_start_date IS NOT NULL THEN 'Суды' ELSE null END,
                    CASE WHEN d.litigation_people_claim = true THEN 'Иск граждан' ELSE null END,
                    CASE WHEN d.has_defects = true THEN 'Дефекты' ELSE null END,
                    CASE WHEN d.reject_date IS NOT NULL THEN 'Отказ' ELSE null END
            ], NULL)::varchar[] as problems,
            CASE 
                WHEN d.manual_stage_date IS NOT NULL AND s.expected_done_days IS NULL THEN 'Работа завершена'::varchar -- ручной завершенный этап
                WHEN s.id IN (1, 26, 27, 28) THEN 'Работа завершена'::varchar
                WHEN s.id = 12 THEN 'В работе у МФР'::varchar
                WHEN d.resetlement_start IS NULL THEN 'Без отклонений'::varchar
                WHEN (d.resetlement_start + (s.expected_done_days::text || 'days')::interval)::date <= NOW()::date THEN 'Риск'::varchar
                WHEN (d.resetlement_start + (s.expected_done_days::text || 'days')::interval)::date <= (NOW()::date + '7 days'::interval) THEN 'Требует внимания'::varchar
                ELSE 'Без отклонений'::varchar
            END as deviation
        FROM dates_prepared d 
        LEFT JOIN renovation.apartment_stages s ON s.id = 
            CASE
                WHEN d.is_executed = true OR d.need_no_execution = true THEN 27
                WHEN d.contract_date IS NOT Null THEN 26
                WHEN d.custody_date IS NOT NULL OR (d.kpu_close_reason IS NOT NULL AND d.kpu_close_reason <> 'п.2 выдан ордер по данной постановке') THEN 1 -- высокоприоритетные признаки свободности
                WHEN d.manual_stage_id IS NOT NULL THEN d.manual_stage_id -- внучную введённые статусы
                WHEN d.is_mfr = true THEN 12
                WHEN d.won_contract_project_date IS NOT NULL THEN 25
                WHEN d.won_rd_date IS NOT NULL THEN 24
                WHEN d.last_fssp_institute_date IS NOT NULL THEN 23
                WHEN d.litigation_fssp_list_date IS NOT NULL THEN 22
                WHEN d.lost_contract_prelimenary_signing_date IS NOT NULL THEN 21
                WHEN d.lost_contract_project_date IS NOT NULL THEN 20
                WHEN d.lost_rd_date IS NOT NULL THEN 19
                WHEN d.lost_accept_date IS NOT NULL THEN 18
                WHEN d.lost_inspection_date IS NOT NULL THEN 17
                WHEN d.last_act_lost IS NOT NULL THEN 16
                WHEN d.last_act_won IS NOT NULL THEN 15
                WHEN d.claim_submission_date IS NOT NULL THEN 14
                WHEN d.litigation_start_date IS NOT NULL THEN 13
                WHEN d.is_msg_rent = true THEN 28
                WHEN d.contract_prelimenary_signing_date IS NOT NULL THEN 11
                WHEN d.contract_notification_date IS NOT Null THEN 10
                WHEN d.contract_project_date IS NOT Null THEN 9
                WHEN d.rd_date IS NOT Null THEN 8
                WHEN LOWER(d.requirement) LIKE '%не требуется%' OR LOWER(d.fio) LIKE '%свободн%' OR d.notes = 'ДГИ. Свободна' THEN 1 -- низкоприоритетные признаки свободности
                WHEN d.accept_date IS NOT Null THEN 7
                WHEN d.reinspection_date IS NOT Null THEN 6
                WHEN d.reject_date IS NOT Null THEN 5
                WHEN d.inspection_date IS NOT Null THEN 4
                WHEN LOWER(d.old_apart_status) LIKE ANY (ARRAY['%аренда%', '%федеральная%', '%служебн%', '%общежит%']) THEN 2
            ELSE 3
        END
    ), final_apart AS (
        SELECT 
            id,
            building_id,
            stages_dates,
            jsonb_build_object(
                'stageId', stage_id,
                'stageName', stage,
                'action', next_action,
                'problems', problems,
                'deviation', deviation,
                'stageDate', stages_dates->camel_case_key->>'date',
                'stageDueDate', ((stages_dates->camel_case_key->>'date')::date + (expected_done_days::text || 'days')::interval)::date
            ) as classificator
        FROM classified 
    )

    -- =============== UPDATE QUERY ===============
    UPDATE renovation.apartments_old_temp a
    SET stages_dates = f.stages_dates,
        classificator = f.classificator
    FROM final_apart f
    WHERE f.id = a.id
    AND f.id = ANY(apartment_ids);

    -- -- =============== NORMAL SELECTOR YO ===============
    -- SELECT *
    -- FROM final_apart 
    -- WHERE id = ANY(ARRAY[
    --  989736,
    -- 	989046,
    -- 	179490,
    -- 	989064,
    -- 	1006102
    -- ])

    -- -- =============== DIFFERENCE ===============
    -- SELECT c.id, a.adress, a.apart_num, a.fio, c.stage_id, c.stage, a.stage_id as old_stage_id, a.stage as old_stage
    -- FROM classified c
    -- LEFT JOIN renovation.apartments_full a ON a.old_apart_id = c.id
    -- WHERE c.stage_id <> a.stage_id

    -- -- =============== STAGES NUMBER COMPARE ===============
    -- SELECT o.stage_id, o.stage, 
    -- o.total as old, 
    -- n.total as new,
    -- o.total - n.total as change
    -- FROM
    -- (
    -- SELECT stage_id, stage, COUNT(*) as total
    -- FROM renovation.apartments_full
    -- GROUP BY stage_id, stage
    -- ) o
    -- LEFT JOIN 
    -- (
    -- SELECT stage_id, stage, COUNT(*) as total
    -- FROM classified
    -- GROUP BY stage_id, stage
    -- ) n ON n.stage_id = o.stage_idz

END;
$BODY$   
LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION renovation.update_classificator(integer [])   
OWNER to renovation_user;

-- -- Команда на пересчёт всех данных
-- SELECT renovation.update_classificator(ids.id_list)
-- FROM (SELECT ARRAY_AGG(id) as id_list FROM renovation.apartments_old_temp) ids;


-- Триггер на таблицу судебных слушаний
CREATE OR REPLACE FUNCTION renovation.litigation_hearing_function()
RETURNS TRIGGER AS $$
DECLARE
    ids integer[];
BEGIN
    ids = (
        SELECT ARRAY_AGG(co.old_apart_id) as id_list 
        FROM renovation.apartment_litigation_hearings h
        LEFT JOIN renovation.apartment_litigations_temp l ON h.litigation_id = l.id
        LEFT JOIN renovation.apartment_litigation_connections co ON l.id = co.litigation_id
        LEFT JOIN (
            SELECT id
            FROM updated_table
        ) cv ON h.id = cv.id 
        WHERE cv.id IS NOT NULL 
    );

    PERFORM renovation.update_classificator(ids);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER litigation_hearing_trigger
AFTER UPDATE ON renovation.apartment_litigation_hearings
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.litigation_hearing_function();

CREATE TRIGGER litigation_hearing_trigger_insert
AFTER INSERT ON renovation.apartment_litigation_hearings
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.litigation_hearing_function();

CREATE TRIGGER litigation_hearing_trigger_delete
AFTER DELETE ON renovation.apartment_litigation_hearings
REFERENCING OLD TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.litigation_hearing_function();


-- Триггер на таблицу судебных поручений
CREATE OR REPLACE FUNCTION renovation.litigation_errants_function()
RETURNS TRIGGER AS $$
DECLARE
    ids integer[];
BEGIN

    ids = (
        SELECT ARRAY_AGG(co.old_apart_id) as id_list
            FROM renovation.apartment_litigation_errants e
            LEFT JOIN renovation.apartment_litigations_temp l ON e.litigation_id = l.id
            LEFT JOIN renovation.apartment_litigation_connections co ON l.id = co.litigation_id
            LEFT JOIN (
                SELECT id
                FROM updated_table
            ) cv on e.id = cv.id
            WHERE cv.id IS NOT NULL
    );

    PERFORM renovation.update_classificator(ids);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER litigation_errants_trigger
AFTER UPDATE ON renovation.apartment_litigation_errants
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.litigation_errants_function();

CREATE TRIGGER litigation_errants_trigger_insert
AFTER INSERT ON renovation.apartment_litigation_errants
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.litigation_errants_function();

CREATE TRIGGER litigation_errants_trigger_delete
AFTER DELETE ON renovation.apartment_litigation_errants
REFERENCING OLD TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.litigation_errants_function();


-- Триггер на таблицу судебных дел
CREATE OR REPLACE FUNCTION renovation.litigations_function()
RETURNS TRIGGER AS $$
DECLARE
    ids integer[];
BEGIN
    ids = (
        SELECT  ARRAY_AGG(co.old_apart_id) as id_list
            FROM renovation.apartment_litigations_temp l
            LEFT JOIN renovation.apartment_litigation_connections co ON l.id = co.litigation_id
            LEFT JOIN (
                SELECT id
                FROM updated_table
            ) cv on l.id = cv.id
            WHERE cv.id IS NOT NULL
    );

    PERFORM renovation.update_classificator(ids);
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER litigations_trigger
AFTER UPDATE ON renovation.apartment_litigations_temp
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.litigations_function();

CREATE TRIGGER litigations_trigger_insert
AFTER INSERT ON renovation.apartment_litigations_temp
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.litigations_function();

CREATE TRIGGER litigations_trigger_delete
AFTER DELETE ON renovation.apartment_litigations_temp
REFERENCING OLD TABLE AS updated_table 
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.litigations_function();


-- Триггер на таблицу связей квартир (ордеров)
CREATE OR REPLACE FUNCTION renovation.apartment_connections_function()
RETURNS TRIGGER AS $$
DECLARE
    ids integer[];
BEGIN
    ids = (
        SELECT ARRAY_AGG(c.old_apart_id) as id_list
        FROM renovation.apartment_connections c
        LEFT JOIN (
            SELECT id
            FROM updated_table
        ) cv on c.id = cv.id
        WHERE cv.id IS NOT NULL
    );

    PERFORM renovation.update_classificator(ids);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER apartment_connections_trigger
AFTER UPDATE ON renovation.apartment_connections
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.apartment_connections_function();

CREATE TRIGGER apartment_connections_trigger_insert
AFTER INSERT ON renovation.apartment_connections
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.apartment_connections_function();

CREATE TRIGGER apartment_connections_trigger_delete
AFTER DELETE ON renovation.apartment_connections
REFERENCING OLD TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.apartment_connections_function();



-- Триггер на таблицу связей старых квартир (КПУ)
CREATE OR REPLACE FUNCTION renovation.apartments_old_function()
RETURNS TRIGGER AS $$
DECLARE
    ids integer[];
BEGIN
    ids = (
        SELECT ARRAY_AGG(a.id) as id_list
        FROM renovation.apartments_old_temp a
        LEFT JOIN (
            SELECT id
            FROM updated_table
        ) cv on a.id = cv.id
        WHERE cv.id IS NOT NULL
    );

    PERFORM renovation.update_classificator(ids);
    
    RETURN Null;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER apartments_old_trigger
    AFTER UPDATE ON renovation.apartments_old_temp
    REFERENCING NEW TABLE AS updated_table
    FOR EACH STATEMENT
    WHEN (pg_trigger_depth() < 1)
    EXECUTE FUNCTION renovation.apartments_old_function();

CREATE TRIGGER apartments_old_trigger_insert
    AFTER INSERT ON renovation.apartments_old_temp
    REFERENCING NEW TABLE AS updated_table
    FOR EACH STATEMENT
    WHEN (pg_trigger_depth() < 1)
    EXECUTE FUNCTION renovation.apartments_old_function();

CREATE TRIGGER apartments_old_trigger_delete
    AFTER DELETE ON renovation.apartments_old_temp
    REFERENCING OLD TABLE AS updated_table
    FOR EACH STATEMENT
    WHEN (pg_trigger_depth() < 1)
    EXECUTE FUNCTION renovation.apartments_old_function();



-- Триггер на таблицу ручных этапов (сообщений)
CREATE OR REPLACE FUNCTION renovation.apartment_messages_function()
RETURNS TRIGGER AS $$
DECLARE
    ids integer[];
BEGIN
    ids = (
        SELECT ARRAY_AGG(m.apartment_id) as id_list
        FROM renovation.messages m
        LEFT JOIN (
            SELECT id
            FROM updated_table
        ) cv on m.id = cv.id
        WHERE cv.id IS NOT NULL
    );

    PERFORM renovation.update_classificator(ids);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_trigger
AFTER UPDATE ON renovation.messages
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.apartment_messages_function();

CREATE TRIGGER messages_trigger_insert
AFTER INSERT ON renovation.messages
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.apartment_messages_function();

CREATE TRIGGER messages_trigger_delete
AFTER DELETE ON renovation.messages
REFERENCING OLD TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.apartment_messages_function();

-- ========================================================================================
-- =============================== ВСПОМОГАТЕЛЬНЫЕ ТРИГГЕРЫ ===============================
-- ========================================================================================

-- Триггер на таблицу новых квартир
CREATE OR REPLACE FUNCTION renovation.new_aparts_function()
RETURNS TRIGGER AS $$
BEGIN

    WITH affected_old_aparts AS (
        SELECT 
        DISTINCT c.old_apart_id
        FROM renovation.apartment_connections c
        LEFT JOIN (
                SELECT id
                FROM updated_table
            ) cv on c.new_apart_id = cv.id
        WHERE cv.id IS NOT NULL
    ), new_appartment_list AS (
		SELECT
        c.old_apart_id,
		jsonb_agg(DISTINCT jsonb_build_object(
			'unom', an.unom,
			'unkv', an.unkv,
			'adress', an.adress,
			'num', an.apart_num,
			'areaZhil', an.area_zhil,
			'areaObsh', an.area_obsh,
			'areaZhp', an.area_zhp,
			'roomCount', an.room_count,
            'defects', CASE WHEN an.defect_complaint_date IS NOT NULL AND c.status_prio = c.max_status THEN TRUE ELSE FALSE END,
			'status', CASE 
                         WHEN COALESCE(c.rd_date, c.contract_date) IS NOT NULL THEN 'Предоставление'
                         WHEN LOWER(c.inspection_response) LIKE '%соглас%' THEN 'Согласие'
                         WHEN LOWER(c.inspection_response) LIKE '%отказ%' THEN 'Отказ'
                         ELSE 'Осмотр'
				      END
		)) as new_aparts
        FROM renovation.apartments_new an
        LEFT JOIN (SELECT *, MAX(status_prio) OVER (PARTITION BY old_apart_id) as max_status FROM renovation.apartment_connections) c ON c.new_apart_id = an.id
        LEFT JOIN affected_old_aparts aa ON aa.old_apart_id = c.old_apart_id
        WHERE aa.old_apart_id IS NOT NULL
        GROUP BY c.old_apart_id
    )
    UPDATE renovation.apartments_old_temp a
    SET new_aparts = na.new_aparts
    FROM new_appartment_list na
    WHERE na.old_apart_id = a.id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_aparts_trigger
AFTER UPDATE ON renovation.apartments_new
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.new_aparts_function();

CREATE TRIGGER new_aparts_trigger_isert
AFTER INSERT ON renovation.apartments_new
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.new_aparts_function();

CREATE TRIGGER new_aparts_trigger_delete
AFTER DELETE ON renovation.apartments_new
REFERENCING OLD TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.new_aparts_function();


-- Триггер на таблицу дат по старым домам
CREATE OR REPLACE FUNCTION renovation.dates_buildings_old_function()
RETURNS TRIGGER AS $$
BEGIN

    WITH affected_buildings AS (
        SELECT b.building_id
        FROM renovation.dates_buildings_old b
        LEFT JOIN updated_table u ON u.id = b.id
        WHERE u.id IS NOT NULL
    ), building_dates AS ( 
        SELECT 
            building_id,
            -- плановые даты
            min(control_date) FILTER (WHERE date_type = 5) AS plan_first_resettlement_start,
            (min(control_date) FILTER (WHERE date_type = 5) + '8 mons'::interval)::date AS plan_first_resettlement_end,
            (min(control_date) FILTER (WHERE date_type = 5) + '9 mons'::interval)::date AS plan_second_resettlement_end,
            (min(control_date) FILTER (WHERE date_type = 5) + '1 year'::interval)::date AS plan_demolition_end,
            -- фактические даты
            min(control_date) FILTER (WHERE date_type = 1) AS actual_first_resettlement_start,
            min(control_date) FILTER (WHERE date_type = 2) AS actual_first_resettlement_end,
            min(control_date) FILTER (WHERE date_type = 3) AS actual_second_resettlement_end,
            min(control_date) FILTER (WHERE date_type = 4) AS actual_demolition_end,
			-- дополнительные даты
			min(control_date) FILTER (WHERE date_type = 7) AS partial_start,
			min(control_date) FILTER (WHERE date_type = 6) AS partial_end,
			max(control_date) FILTER (WHERE date_type = 8) AS boss_control
        FROM ( 
            SELECT 
                od.building_id,
                od.date_type,
                od.control_date,
                row_number() OVER (PARTITION BY od.building_id, od.date_type ORDER BY od.is_manual DESC, od.updated_at DESC, od.id) AS rank
            FROM renovation.dates_buildings_old od
            LEFT JOIN (
                SELECT building_id
                FROM affected_buildings
            ) cv on od.building_id = cv.building_id
            WHERE cv.building_id IS NOT NULL -- AND od.control_date IS NOT NULL
        ) d WHERE d.rank = 1
        GROUP BY building_id
 )
    UPDATE renovation.buildings_old b
    SET terms = jsonb_build_object(
           'plan', jsonb_build_object(
					'firstResetlementStart', bd.plan_first_resettlement_start,
					'firstResetlementEnd', bd.plan_first_resettlement_end,
					'secontResetlementEnd', bd.plan_second_resettlement_end,
					'demolitionEnd', bd.plan_demolition_end),
           'actual', jsonb_build_object(
					'firstResetlementStart', bd.actual_first_resettlement_start,
					'firstResetlementEnd', bd.actual_first_resettlement_end,
					'secontResetlementEnd', bd.actual_second_resettlement_end,
					'demolitionEnd', bd.actual_demolition_end),
            'doneDate', COALESCE(bd.actual_first_resettlement_end, bd.actual_second_resettlement_end, bd.actual_demolition_end),
            'partialStart', bd.partial_start,
            'partialEnd', bd.partial_end,
            'bossControl', bd.boss_control
	)
    FROM building_dates bd
    WHERE bd.building_id = b.id;

    RETURN New;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER dates_buildings_old_trigger
AFTER UPDATE ON renovation.dates_buildings_old
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.dates_buildings_old_function();

CREATE TRIGGER dates_buildings_old_trigger_insert
AFTER INSERT ON renovation.dates_buildings_old
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.dates_buildings_old_function();

CREATE TRIGGER dates_buildings_old_trigger_delete
AFTER DELETE ON renovation.dates_buildings_old
REFERENCING OLD TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.dates_buildings_old_function();




-- Триггер на таблицу дат по новым домам
CREATE OR REPLACE FUNCTION renovation.dates_buildings_new_function()
RETURNS TRIGGER AS $$
BEGIN

    WITH affected_buildings AS (
        SELECT b.building_id
        FROM renovation.dates_buildings_new b
        LEFT JOIN updated_table u ON u.id = b.id
        WHERE u.id IS NOT NULL
    ), building_dates AS ( 
        SELECT building_id,
                json_build_object(
                    'plan', json_build_object(
                            'commissioning', min(control_date) FILTER (WHERE date_type = 3),
                            'settlement', min(control_date) FILTER (WHERE date_type = 4)),
                    'actual', json_build_object(
                            'commissioning', min(control_date) FILTER (WHERE date_type = 1),
                            'settlement', min(control_date) FILTER (WHERE date_type = 2))
                ) as terms
        FROM (SELECT 
                    nb.building_id,
                    nb.date_type,
                    nb.control_date,
                    row_number() OVER (PARTITION BY nb.building_id, nb.date_type ORDER BY nb.is_manual DESC, nb.updated_at DESC, nb.id) AS rank
                FROM renovation.dates_buildings_new nb
                LEFT JOIN (
                    SELECT building_id
                    FROM affected_buildings
                ) cv on nb.building_id = cv.building_id
                WHERE cv.building_id IS NOT NULL
            ) d WHERE d.rank = 1
        GROUP BY building_id
 )
    UPDATE renovation.buildings_new b
    SET terms = bd.terms
    FROM building_dates bd
    WHERE bd.building_id = b.id;

    RETURN New;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dates_buildings_new_trigger
AFTER UPDATE ON renovation.dates_buildings_new
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.dates_buildings_new_function();

CREATE TRIGGER dates_buildings_new_trigger_insert
AFTER INSERT ON renovation.dates_buildings_new
REFERENCING NEW TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.dates_buildings_new_function();

CREATE TRIGGER dates_buildings_new_trigger_delete
AFTER DELETE ON renovation.dates_buildings_new
REFERENCING OLD TABLE AS updated_table
FOR EACH STATEMENT
EXECUTE FUNCTION renovation.dates_buildings_new_function();