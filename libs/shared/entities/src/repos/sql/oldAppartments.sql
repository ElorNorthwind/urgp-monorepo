WITH connections AS (
	SELECT 
		(COUNT(*) FILTER (WHERE c.rd_date IS NOT NULL OR c.contract_date IS NOT NULL) OVER (PARTITION BY c.old_apart_id) = 0 -- если нет РДшек
	    AND (COUNT(*) FILTER (WHERE LOWER(inspection_response) NOT LIKE '%отказ%') OVER (PARTITION BY c.old_apart_id) > 0  OR LOWER(inspection_response) NOT LIKE '%отказ%')) -- и либо нет неотказов либо само является неотказом
	    OR c.rd_date IS NOT NULL OR c.contract_date IS NOT NULL as actual, -- либо если само - РДшка
		max(c.inspection_response_date) FILTER (WHERE c.inspection_response LIKE '%отказ%') OVER (PARTITION BY c.old_apart_id) as reject_date,
		a.unom as new_apart_unom,
		a.unom as new_apart_unom,
		a.unkv as new_apart_unkv,
		a.adress as new_apart_adress,
		a.apart_num as new_apart_num,
		a.area as new_apart_area,
		a.room_count as new_apart_room_count,
		c.*
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
), connections_info AS (
	SELECT 
    old_apart_id,
	string_agg(DISTINCT order_reason, '; ') FILTER (WHERE actual = true)  as order_reasons,
	string_agg(new_apart_adress || ', кв. ' || new_apart_num, '; ') FILTER (WHERE actual = true) as adress_list,
	min(order_date) as order_date,
	min(order_date) FILTER (WHERE order_reason = 'Московский фонд реновации жилой застройки'::text) as mfr_date,
    min(inspection_date) as inspection_date,
	max(inspection_response_date) FILTER (WHERE LOWER(inspection_response) LIKE '%согл%') as accept_date,
	max(reject_date) as reject_date,
	max(inspection_date) FILTER (WHERE reject_date IS NOT NULL AND inspection_date > reject_date) as reinspection_date,
	max(rd_date) as rd_date,
	max(COALESCE(contract_date, rd_date)) FILTER (WHERE contract_status LIKE 'Проект') as contract_project_date,
	max(contract_prelimenary_signing_date) as contract_prelimenary_signing_date,
	max(contract_date) FILTER (WHERE contract_status NOT LIKE 'Проект') as contract_date
	,json_agg(json_build_object(
			'status', status,
            'reason', order_reason,
			'actual', actual,
			'adress', new_apart_adress,
			'apartNumber', new_apart_num,
			'area', new_apart_area,
			'roomCount', new_apart_room_count,
			'inspectionDate', inspection_date,
			'inspectionResponseDate', inspection_response_date,
			'inspectionResponse', inspection_response_date,
			'rdDate', rd_date,
			'rdNum', rd_num,
			'contractStatus', contract_status,
			'contractDate', contract_date,
			'contractNum', contract_num
		)) as orders
	FROM connections 
	GROUP BY old_apart_id
), last_litigation_docs AS (
	SELECT 
	COUNT(*) OVER w as cases_count,
  	MIN(claim_date) OVER w as first_claim_date,
	MAX(claim_submission_date) OVER w as last_claim_date,
	old_apart_id, updated_at, 
	claim_date, claim_submission_date, claim_num,
	case_num, case_num_dgi, case_category, case_result,
	last_act_date, changes_date, act_date, appeal_date, 
	hearing_date, hearing_result, hearing_result_class,
	notes, subject_of_proceedings, final_result,
	decision_date,
   RANK() OVER w_sorted as rank
    ,json_agg(json_build_object(
	   'claimDate', claim_date,
	   'caseNum', case_num,
	   'caseCategody', case_category,
	   'caseResult', case_result, 
	   'hearingResult', hearing_result,
	   'subjectOfProceedings', subject_of_proceedings,
	   'finalResult', final_result,
	   'notes', notes,
	   'hearingDate', hearing_date,
	   'lastActDate', last_act_date, 
	   'appealDate', appeal_date,
	   'decisionDate', decision_date
	)) over w as cases
	FROM (
		SELECT 
		RANK() OVER (PARTITION BY old_apart_id, case_num_dgi ORDER BY hearing_date DESC, updated_at DESC, id) as rank, 
		CASE WHEN final_result = 'Ведётся' THEN 0 ELSE 1 END as doubt_prio,
		(SELECT max(d) from unnest(ARRAY[last_act_date, appeal_date, hearing_date]) d) as decision_date,
		* 
		FROM renovation.apartment_litigations
	) lit WHERE lit.rank = 1 AND hearing_result_class LIKE '%ДГИ%'
	WINDOW w AS (PARTITION BY old_apart_id),
	w_sorted AS (PARTITION BY old_apart_id ORDER BY doubt_prio, hearing_date DESC, updated_at DESC, id)
), last_litigation_info AS (
	SELECT old_apart_id,
		   first_claim_date, last_claim_date, decision_date,
	       cases_count, final_result
	       ,cases
	FROM last_litigation_docs
	WHERE rank = 1
), old_dates_ranked AS (
	SELECT building_id,
		   date_type,
		   control_date,
		   updated_at,
		   id,
		   rank() OVER (PARTITION BY building_id, date_type ORDER BY updated_at DESC, id) AS rank
	FROM renovation.dates_buildings_old

), classificator AS (
    SELECT c.difficulty_id, c.status_id,
    d.difficulty_name as difficulty, s.full_name as status, 
    s.group_name as status_group,
    c.next_step_term
    FROM renovation.apartment_status_connections c
    LEFT JOIN renovation.apartment_statuses s on s.id = c.status_id
    LEFT JOIN renovation.apartment_difficultues d on d.id = c.difficulty_id
    ORDER BY c.difficulty_id, c.status_id
), full_data AS (
	SELECT 
		o.id,
		o.building_id as "oldApartBuildingId",
		b.okrug,
		b.district,
		b.adress as "oldApartAdress",
		o.apart_num as "oldApartNum",
		o.apart_type as "oldApartType",
		o.area as "oldApartArea",
		o.room_count as "oldApartRoomCount",
		o.fio,
		o.people_count as "peopleCount",
		o.requirement,
		o.old_apart_status as "oldApartStatus",
		-- c.order_reasons as orderReasons,
		-- c.adress_list as newApartAdresses,
		l.final_result as "litigationResult",
		o.notes,
        cl.status_id as "statusId",
		cl.difficulty_id as "difficultyId",
        cl.status_group as "statusGroup",
        cl.difficulty,
        cl.status,
		CASE 
			WHEN cl.status_id = 13 THEN 'Без отклонений'::varchar
			WHEN d.actual_first_resettlement_start IS NULL THEN 'Без отклонений'::varchar
			WHEN (d.actual_first_resettlement_start + (cl.next_step_term::text || 'days')::interval)::date <= NOW()::date THEN 'Риск'::varchar
			WHEN (d.actual_first_resettlement_start + (cl.next_step_term::text || 'days')::interval)::date <= (NOW()::date + '7 days'::interval) THEN 'Требует внимания'::varchar
			ELSE 'Без отклонений'::varchar
		END as deviation,
        (d.actual_first_resettlement_start + (cl.next_step_term::text || 'days')::interval)::date as "nextStepTerm",
		json_build_object(
            'resettlementStart', d.actual_first_resettlement_start,
            'order', c.order_date,
            'mfr', c.mfr_date,
            'inspection', c.inspection_date,
            'accept', c.accept_date,
            'reject', c.reject_date,
            'reinspection', c.reinspection_date,
            'litigationClaim', l.last_claim_date,
            'litigationDecision', CASE WHEN l.final_result <> 'Ведётся' THEN l.decision_date ELSE null END,
            'rd', c.rd_date,
            'contractProject', c.contract_project_date,
            'contractPrelimenatySigning', c.contract_prelimenary_signing_date,
            'contract', c.contract_date
		) as dates,
		c.orders,	
		l.cases as litigationCases

	 FROM
	renovation.apartments_old_temp o
	LEFT JOIN connections_info c ON o.id = c.old_apart_id
	LEFT JOIN last_litigation_info l ON o.id = l.old_apart_id
	LEFT JOIN renovation.buildings_old b on o.building_id = b.id
	LEFT JOIN (SELECT building_id, min(control_date) as actual_first_resettlement_start FROM old_dates_ranked WHERE date_type = 1 AND rank = 1 GROUP BY building_id) d ON d.building_id = b.id
    LEFT JOIN classificator cl ON
        CASE
            WHEN c.contract_date IS NOT NULL THEN 13 -- 'Договор - заключен'
            WHEN c.contract_prelimenary_signing_date IS NOT NULL THEN 12 -- 'Договор - назначено'
            WHEN c.contract_project_date IS NOT NULL THEN 11 -- 'Договор - проект'
            WHEN c.rd_date IS NOT NULL THEN 8 -- 'Распоряжение - издано'
            WHEN l.final_result <> 'Ведётся' AND l.decision_date IS NOT NULL THEN 10 -- 'Суд - решение'
            WHEN l.last_claim_date IS NOT NULL THEN 9 -- 'Суд - разбирательства'
            WHEN c.accept_date IS NOT NULL THEN 7 -- 'Распоряжение - в работе'
            WHEN c.reinspection_date IS NOT NULL THEN 6 -- 'Отказ - переподбор'
            WHEN c.reject_date IS NOT NULL THEN 5 -- 'Отказ - в работе'
            WHEN c.mfr_date IS NOT NULL THEN 2 -- 'МФР - в работе'
            WHEN c.inspection_date IS NOT NULL THEN 4 -- 'Первичная работа - на осмотре'
            WHEN LOWER(o.requirement) LIKE '%не требуется%' OR LOWER(o.fio) LIKE '%свободн%' Then 1 -- 'Не требуется - свободно'
            ELSE 3 -- 'Первичная работа - не предлагалось'
        END	= cl.status_id

        AND 

        CASE
            WHEN c.reject_date IS NOT NULL THEN 5 -- 'МФР'
            WHEN l.last_claim_date IS NOT NULL THEN 4 -- 'Суд'
            WHEN c.reject_date IS NOT NULL THEN 3 -- 'Переподбор'
            WHEN old_apart_status LIKE '%аренда%' OR old_apart_status LIKE '%федеральная%' THEN 2 -- 'Проблемный'
            ELSE 1 -- 'Обычное'
        END = cl.difficulty_id
)

SELECT * FROM full_data
${conditions:raw}
LIMIT ${limit} OFFSET ${offset};