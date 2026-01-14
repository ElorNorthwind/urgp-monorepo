WITH timeline AS (
	SELECT 
		old_apart_id,
		'РСМ 2.0 - свод реновации' as source,
		adress || ' кв. ' || apart_num as apart_or_case,
		order_date as date,
        0 as prio,
		'Создана выписка' as type,
		order_series || ' № ' || order_num || ' - ' || order_reason as notes
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
	WHERE order_date IS NOT NULL

	UNION
	SELECT 
		old_apart_id,
		'РСМ 2.0 - свод реновации' as source,
		adress || ' кв. ' || apart_num as apart_or_case,
		inspection_date as date,
        1 as prio,
		'Смотровой подписан' as type,
		null as notes
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
	WHERE inspection_date IS NOT NULL

	UNION
	SELECT 
		old_apart_id,
		'РСМ 2.0 - свод реновации' as source,
		adress || ' кв. ' || apart_num as apart_or_case,
		inspection_response_date as date,
        2 as prio,
		'Ответ по смотровому' as type,
		inspection_response as notes
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
	WHERE inspection_response_date IS NOT NULL

	UNION
	SELECT 
		old_apart_id,
		'РСМ 2.0 - свод реновации' as source,
		adress || ' кв. ' || apart_num as apart_or_case,
		rd_date as date,
        3 as prio,
		'Издано РД' as type,
		'№ ' || rd_num as notes
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
	WHERE rd_date IS NOT NULL

	UNION
	SELECT 
		old_apart_id,
		'РСМ 2.0 - проекты договоров' as source,
		adress || ' кв. ' || apart_num as apart_or_case,
		contract_creation_date as date,
        4 as prio,
		'Создан проект договора' as type,
		'№ ' || contract_num as notes
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
	WHERE contract_creation_date IS NOT NULL

	UNION
	SELECT 
		old_apart_id,
		'РСМ 2.0 - свод реновации' as source,
		adress || ' кв. ' || apart_num as apart_or_case,
		contract_prelimenary_signing_date as date,
        5 as prio,
		'Назначена предварительная дата подписания' as type,
		Null as notes
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
	WHERE contract_prelimenary_signing_date IS NOT NULL

	UNION
	SELECT 
		old_apart_id,
		'РСМ 2.0 - свод реновации' as source,
		adress || ' кв. ' || apart_num as apart_or_case,
		contract_delay_date as date,
        0 as prio,
		'Установлена причина задержки подписания' as type,
		contract_delay_comment as notes
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
	WHERE contract_delay_date IS NOT NULL

	UNION
	SELECT 
		old_apart_id,
		'РСМ 2.0 - свод реновации' as source,
		adress || ' кв. ' || apart_num as apart_or_case,
		contract_notification_date as date,
        6 as prio,
		'Направлено заказное уведомление' as type,
		'№ ' || contract_notification_num as notes
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
	WHERE contract_notification_date IS NOT NULL
	
	UNION
	SELECT 
		old_apart_id,
		'РСМ 2.0 - свод реновации' as source,
		adress || ' кв. ' || apart_num as apart_or_case,
		contract_date as date,
        7 as prio,
		'Заключен договор' as type,
		'№ ' || contract_num as notes
	FROM renovation.apartment_connections c
	LEFT JOIN renovation.apartments_new a ON a.id = c.new_apart_id
	WHERE contract_date IS NOT NULL AND LOWER(contract_status) <> 'проект договора'
	
	-- СУДЕБНЫЕ ЭТАПЫ - основная таблица
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - основная таблица' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		l.claim_date as date,
        1 as prio,
		'Подготовлен иск' as type,
		'№ ' || l.claim_num as notes
	FROM renovation.apartment_litigation_connections c
	LEFT JOIN  renovation.apartment_litigations l on l.id = c.litigation_id
	WHERE l.claim_date IS NOT NULL
	
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - основная таблица' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		l.claim_submission_date as date,
        2 as prio,
		'Подан иск' as type,
		'№ ' || l.claim_num as notes
	FROM renovation.apartment_litigation_connections c
	LEFT JOIN  renovation.apartment_litigations l on l.id = c.litigation_id
	WHERE l.claim_submission_date IS NOT NULL
	
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - основная таблица' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		l.last_act_date as date,
        3 as prio,
		'Принят судебный акт' as type,
		l.case_result as notes
	FROM renovation.apartment_litigation_connections c
	LEFT JOIN  renovation.apartment_litigations l on l.id = c.litigation_id
	WHERE l.last_act_date IS NOT NULL
	
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - ФССП' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		l.fssp_doc_date as date,
        0 as prio,
		'Работа по исполнительному производству' as type,
		ARRAY_TO_STRING(ARRAY['ИП № ' || fssp_num, fssp_actions_taken, fssp_status, fssp_execution_status], '; ') as notes
	FROM renovation.apartment_litigation_connections c
	LEFT JOIN  renovation.apartment_litigations l on l.id = c.litigation_id
	WHERE l.fssp_doc_date IS NOT NULL
	
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - ФССП' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		l.fssp_institute_date as date,
        2 as prio,
		'Возбуждено исполнительное производство' as type,
		ARRAY_TO_STRING(ARRAY['ИП № ' || fssp_num, fssp_subject_of_proceedings], '; ') as notes
	FROM renovation.apartment_litigation_connections c
	LEFT JOIN  renovation.apartment_litigations l on l.id = c.litigation_id
	WHERE l.fssp_institute_date IS NOT NULL
		
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - ФССП' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		l.fssp_entry_into_force_date as date,
        1 as prio,
		'Судебный акт вступил в силу' as type,
		Null as notes
	FROM renovation.apartment_litigation_connections c
	LEFT JOIN  renovation.apartment_litigations l on l.id = c.litigation_id
	WHERE l.fssp_entry_into_force_date IS NOT NULL
			
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - ФССП' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		l.fssp_list_date as date,
        3 as prio,
		'Исполнительный лист выпущен' as type,
		'№ ' || l.fssp_list_num as notes
	FROM renovation.apartment_litigation_connections c
	LEFT JOIN  renovation.apartment_litigations l on l.id = c.litigation_id
	WHERE l.fssp_list_date IS NOT NULL
			
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - ФССП' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		l.fssp_list_send_date as date,
        4 as prio,
		'Исполнительный лист направлен' as type,
		'№ ' || l.fssp_list_num as notes
	FROM renovation.apartment_litigation_connections c
	LEFT JOIN  renovation.apartment_litigations l on l.id = c.litigation_id
	WHERE l.fssp_list_send_date IS NOT NULL
	
			
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - слушанья' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		h.hearing_date as date,
        0 as prio,
		'Судебное слушанье' as type,
		ARRAY_TO_STRING(ARRAY[h.subject_of_proceedings, h.hearing_result, h.hearing_result_class, h.notes], '; ') as notes
	FROM renovation.apartment_litigation_hearings h
	LEFT JOIN renovation.apartment_litigations l ON l.id = h.litigation_id
	LEFT JOIN renovation.apartment_litigation_connections c ON c.litigation_id = h.litigation_id
	WHERE l.fssp_list_send_date IS NOT NULL
	
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - слушанья' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		h.act_date as date,
        3 as prio,
		'Судебный акт' as type,
		ARRAY_TO_STRING(ARRAY[h.subject_of_proceedings, h.hearing_result, h.hearing_result_class, h.notes], '; ') as notes
	FROM renovation.apartment_litigation_hearings h
	LEFT JOIN renovation.apartment_litigations l ON l.id = h.litigation_id
	LEFT JOIN renovation.apartment_litigation_connections c ON c.litigation_id = h.litigation_id
	WHERE h.act_date IS NOT NULL

	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - слушанья' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		h.hearing_date as date,
        0 as prio,
		'Назначена дата слушанья' as type,
		ARRAY_TO_STRING(ARRAY[h.subject_of_proceedings, h.hearing_result, h.hearing_result_class, h.notes], '; ') as notes
	FROM renovation.apartment_litigation_hearings h
	LEFT JOIN renovation.apartment_litigations l ON l.id = h.litigation_id
	LEFT JOIN renovation.apartment_litigation_connections c ON c.litigation_id = h.litigation_id
	WHERE h.hearing_date IS NOT NULL
	
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - слушанья' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		h.appeal_date as date,
        4 as prio,
		'Обжалование решения' as type,
		ARRAY_TO_STRING(ARRAY[h.subject_of_proceedings, h.hearing_result, h.hearing_result_class, h.notes], '; ') as notes
	FROM renovation.apartment_litigation_hearings h
	LEFT JOIN renovation.apartment_litigations l ON l.id = h.litigation_id
	LEFT JOIN renovation.apartment_litigation_connections c ON c.litigation_id = h.litigation_id
	WHERE h.appeal_date IS NOT NULL
	
	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - поручения' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		e.errant_date as date,
        0 as prio,
		'Поручение дано' as type,
		ARRAY_TO_STRING(ARRAY[e.errant_type, '(' || e.errant_status || ')'], ' ') as notes
	FROM renovation.apartment_litigation_errants e
	LEFT JOIN renovation.apartment_litigations l ON e.litigation_id = l.id
	LEFT JOIN renovation.apartment_litigation_connections c ON c.litigation_id = e.litigation_id
	WHERE e.errant_date IS NOT NULL

	UNION
	SELECT 
		c.old_apart_id,
		'Судебная подсистема - поручения' as source,
		ARRAY_TO_STRING(ARRAY[case_num_dgi, case_category], ' - ') as apart_or_case,
		e.errant_complition_date as date,
        1 as prio,
		'Поручение выполнено' as type,
		ARRAY_TO_STRING(ARRAY[e.errant_type, '(' || e.errant_status || ')'], ' ') as notes
	FROM renovation.apartment_litigation_errants e
	LEFT JOIN renovation.apartment_litigations l ON e.litigation_id = l.id
	LEFT JOIN renovation.apartment_litigation_connections c ON c.litigation_id = e.litigation_id
	WHERE e.errant_complition_date IS NOT NULL
)

SELECT 
-- 	old_apart_id,
	ROW_NUMBER() OVER(PARTITION BY old_apart_id ORDER BY date ASC, prio ASC)::integer as npp,
	source,
	apart_or_case as group,
	date,
	type,
	notes
FROM timeline 
WHERE old_apart_id = ${id}
ORDER BY date ASC, prio ASC