-- Консультации - краткое представление
DROP VIEW IF EXISTS vks.cases_slim_view CASCADE;
CREATE OR REPLACE VIEW vks.cases_slim_view  AS
----------------------------------------------------------------------
    SELECT
        c.id,
        c.date,
        c.time,
        c.service_id as "serviceId", 
        s.short_name as "serviceName",

        s.property_type as "propertyType",
        s.department_id as "departmentId",
        d.display_name as "departmentName",
        d.zam_id as "zamId",
        z.short_name as "zamName",

        c.status,
        c.booking_code as "bookingCode",

        CASE 
            WHEN c.booking_source = 'Онлайн консультации' THEN  'Онлайн'
            WHEN c.booking_source = 'Бронирование через приложение Календарь' THEN  'Календарь'
            WHEN c.booking_source = 'Портал государственных и муниципальных услуг города Москвы' THEN  'Портал ГУ'
            ELSE  'Иной'
        END as "bookingSource",
        CASE 
            WHEN  (c.problem_audio = '1' 
                OR c.problem_video = '1' 
                OR c.problem_connection = '1' 
                OR c.problem_tech = '1'
                OR c.operator_survey_problems && ARRAY['Ошибки с подключением к консультации у сотрудника/заявителя', 'Проблемы с видео/звуком у заявителя/сотрудника', 'Не пришла ссылка']) 
            THEN true 
            ELSE false 
        END as "hasTechnicalProblems",
        c.is_technical as "isTechnical",
        CASE 
            WHEN c.online_grade IS NOT NULL THEN 'online'
            WHEN c.client_survey_grade IS NOT NULL THEN 'survey'
            WHEN c.online_grade_comment IS NOT NULL THEN 'online'
            ELSE 'none'
        END as "gradeSource",
        COALESCE(c.online_grade, c.client_survey_grade) as grade,
        ARRAY_TO_STRING(ARRAY_REMOVE(ARRAY[c.client_survey_comment_positive, c.client_survey_comment_negative, c.online_grade_comment], null), '; ') as "gradeComment",
        -- COALESCE(COALESCE(c.client_survey_comment_positive, '') || COALESCE(c.client_survey_comment_negative, ''), c.online_grade_comment) as "gradeComment",
        c.client_id as "clientId",

        INITCAP(REPLACE(REGEXP_REPLACE(COALESCE(c.participant_fio, CASE WHEN cl.short_name = 'Организация' THEN null ELSE cl.full_name END, c.deputy_fio), '(^[А-Яа-яёЁ\-]*)\s([А-Яа-яёЁ])(?:[А-Яа-яёЁ\-]*[\s\.]+([А-Яа-яёЁ]))?.*$', '\1 \2.\3.'), '..', '.')) as "clientFio",
        -- COALESCE(c.participant_fio, CASE WHEN cl.short_name = 'Организация' THEN null ELSE cl.full_name END, c.deputy_fio) as "clientFio",
        
        cl.type as "clientType",
        INITCAP(REPLACE(REGEXP_REPLACE(c.operator_survey_fio, '(^[А-Яа-яёЁ\-]*)\s([А-Яа-яёЁ])(?:[А-Яа-яёЁ\-]*[\s\.]+([А-Яа-яёЁ]))?.*$', '\1 \2.\3.'), '..', '.')) as "operatorFio",

		c.operator_link as "operatorLink",
        COALESCE(c.operator_survey_consultation_type, 'Нет данных') as "operatorSurveyConsultationType",
        s.display_name as "serviceFullName",
        c.operator_survey_date as "operatorSurveyDate",
        c.client_survey_date as "clientSurveyDate"

    FROM vks.cases c
    LEFT JOIN vks.clients cl ON cl.id = c.client_id
    LEFT JOIN vks.services s ON c.service_id = s.id
    LEFT JOIN vks.departments d ON s.department_id = d.id
    LEFT JOIN vks.zams z ON d.zam_id = z.id
    ORDER BY c.date DESC NULLS LAST, c.time DESC NULLS LAST, c.id DESC NULLS LAST;
----------------------------------------------------------------------
-- ALTER TABLE vks.cases_slim_view
--     OWNER TO renovation_user;



-- Консультации - детальное представление
DROP VIEW IF EXISTS vks.cases_detailed_view CASCADE;
CREATE OR REPLACE VIEW vks.cases_detailed_view  AS
----------------------------------------------------------------------

        SELECT
        c.id,
        c.date,
        c.time,
        c.service_id as "serviceId", 
        s.short_name as "serviceName",

        s.property_type as "propertyType",
        s.department_id as "departmentId",
        d.display_name as "departmentName",
        d.zam_id as "zamId",
        z.short_name as "zamName",

        c.status,
        c.booking_code as "bookingCode",

        CASE 
            WHEN c.booking_source = 'Онлайн консультации' THEN  'Онлайн'
            WHEN c.booking_source = 'Бронирование через приложение Календарь' THEN  'Календарь'
            WHEN c.booking_source = 'Портал государственных и муниципальных услуг города Москвы' THEN  'Портал ГУ'
            ELSE  'Иной'
        END as "bookingSource",
        CASE 
            WHEN  (c.problem_audio = '1' 
                OR c.problem_video = '1' 
                OR c.problem_connection = '1' 
                OR c.problem_tech = '1'
                OR c.operator_survey_problems && ARRAY['Ошибки с подключением к консультации у сотрудника/заявителя', 'Проблемы с видео/звуком у заявителя/сотрудника', 'Не пришла ссылка'])  
            THEN true 
            ELSE false 
        END as "hasTechnicalProblems",
        c.is_technical as "isTechnical",
        CASE 
            WHEN c.online_grade IS NOT NULL THEN 'online'
            WHEN c.client_survey_grade IS NOT NULL THEN 'survey'
            WHEN c.online_grade_comment IS NOT NULL THEN 'online'
            ELSE 'none'
        END as "gradeSource",
        COALESCE(c.online_grade, c.client_survey_grade) as grade,
        ARRAY_TO_STRING(ARRAY_REMOVE(ARRAY[c.client_survey_comment_positive, c.client_survey_comment_negative, c.online_grade_comment], null), '; ') as "gradeComment",
        c.client_id as "clientId",
        COALESCE(c.participant_fio, CASE WHEN cl.short_name = 'Организация' THEN null ELSE cl.full_name END, c.deputy_fio ) as "clientFio",
        cl.type as "clientType",
        c.operator_survey_fio as "operatorFio",

        
        c.operator_survey_date as "operatorSurveyDate",
        c.client_survey_date as "clientSurveyDate",
		
		
		c.booking_id as "bookingId",
		c.booking_date as "bookingDate",
		c.booking_resource as "bookingResource",
		c.deputy_fio as "deputyFio",
		c.participant_fio as "participantFio",
        cl.org_name as "orgName",
		c.phone,
		c.email,
		
		c.problem_audio as "problemAudio", 
		c.problem_video as "problemVideo",
		c.problem_connection as "problemConnection",
		c.problem_tech as "problemTech",
		c.vks_search_speed as "vksSearchSpeed",
		c.operator_link as "operatorLink",
		c.problem_summary as "problemSummary",
		c.address as "privatizationAddress",
		c.contract_number as "contractNumber",
		c.letter_number as "letterNumber",
		c.fls_number as "flsNumber",
		
		c.operator_survey_id as "operatorSurveyId",
		c.operator_survey_status as "operatorSurveyStatus",
		c.operator_survey_extralink_id as "operatorSurveyExtralinkId",
		c.operator_survey_extralink_url as "operatorSurveyExtralinkUrl",
		
		COALESCE(c.operator_survey_consultation_type, 'Нет данных') as "operatorSurveyConsultationType",
		c.operator_survey_is_housing as "operatorSurveyIsHousing",
		c.operator_survey_is_client as "operatorSurveyIsClient",
		c.operator_survey_address as "operatorSurveyAddress",
		c.operator_survey_relation as "operatorSurveyRelation",
		c.operator_survey_doc_type as "operatorSurveyDocType",
		c.operator_survey_doc_date as "operatorSurveyDocDate",
		c.operator_survey_doc_num as "operatorSurveyDocNum",
		c.operator_survey_department as "operatorSurveyDepartment",
		c.operator_survey_summary as "operatorSurveySummary",
		c.operator_survey_mood as "operatorSurveyMood",
		c.operator_survey_needs_answer as "operatorSurveyNeedsAnswer",
		c.operator_survey_problems as "operatorSurveyProblems",
		c.operator_survey_info_source as "operatorSurveyInfoSource",
		
		c.client_survey_id as "clientSurveyId",
		c.client_survey_status as "clientSurveyStatus",
		c.client_survey_extralink_id as "clientSurveyExtralinkId",
		c.client_survey_extralink_url as "clientSurveyExtralinkUrl",
		c.client_survey_joined as "clientSurveyJoined",
		c.client_survey_consultation_received as "clientSurveyConsultationReceived",
		
		s.display_name as "serviceFullName",
		d.full_name as "departmentFullName",
		z.full_name as "zamFullName"
		
        
		-- COALESCE(COALESCE(c.client_survey_comment_positive, '') || COALESCE(c.client_survey_comment_negative, ''), c.online_grade_comment) as "gradeComment"
		

    FROM vks.cases c
    LEFT JOIN vks.clients cl ON cl.id = c.client_id
    LEFT JOIN vks.services s ON c.service_id = s.id
    LEFT JOIN vks.departments d ON s.department_id = d.id
    LEFT JOIN vks.zams z ON d.zam_id = z.id;
----------------------------------------------------------------------
-- ALTER TABLE vks.cases_detailed_view
--     OWNER TO renovation_user;


-- Консультации - legacy представление
DROP VIEW IF EXISTS vks.consultations_legacy_view CASCADE;
CREATE OR REPLACE VIEW vks.consultations_legacy_view  AS
----------------------------------------------------------------------
SELECT 
    c.id,
	COALESCE(c.booking_code, 'нет') as booking_num,
	c.date as cons_date,
	CASE WHEN c.is_technical THEN 'нет'  ELSE COALESCE(c.online_grade::text, 'нет') END as score_mos,
	COALESCE(c.online_grade_comment, 'нет') as comment_mos,
	CASE WHEN c.online_grade_comment IS NOT NULL AND c.online_grade_comment <> '' THEN 'да' ELSE 'нет' END as comment_mos_true_false,
	-- CASE WHEN c.online_grade IS NOT NULL AND c.online_grade <> 0 THEN 'да' ELSE 'нет' END as comment_mos_true_false,
	COALESCE(s.display_name, 'нет') as service_name,
	c.status as status_suo,
	CASE WHEN cl.type = 'Юридическое лицо' THEN 'нет' ElSE COALESCE(cl.full_name, 'нет') END as client_name,
    -- 'Скрыто' as client_name,
	COALESCE(c.phone, 'нет') as client_phone,
    -- 'Скрыто' as client_phone,
	COALESCE(cl.type, 'нет') as client_type,
	COALESCE(c.time, 'нет') as cons_time,
	COALESCE(c.address, c.operator_survey_address, 'нет') as client_address,
    -- 'Скрыто' as client_address,
	CASE WHEN operator_survey_is_client THEN 'да' ELSE 'нет' END as client_true_false,
	COALESCE(c.operator_survey_summary, c.problem_summary, 'нет') as description,
	COALESCE(c.operator_survey_department, 'нет') as department,
	COALESCE(c.operator_survey_info_source, 'нет') as info_source,
	COALESCE(c.operator_survey_relation, 'нет') as moscow_relation,
	CASE 
		WHEN COALESCE(c.operator_survey_doc_date, '') = '' AND COALESCE(c.operator_survey_doc_num, '') = '' THEN 'нет'
		ELSE ARRAY_TO_STRING(ARRAY[c.operator_survey_doc_date, c.operator_survey_doc_num], ' '::text, '') 
	END as doc_info,
	COALESCE(c.operator_survey_consultation_type, 'нет') as worksheet_status,
	COALESCE(c.operator_survey_doc_type, 'нет') as question_type,
	COALESCE(c.operator_survey_mood, 'нет') as question_tone,
	COALESCE(INITCAP(REPLACE(REGEXP_REPLACE(c.operator_survey_fio, '(^[А-Яа-яЁё\-]*)\s([А-Яа-яЁё])(?:[А-Яа-яЁё\-]*[\s\.]+([А-Яа-яЁё]))?.*$', '\1 \2.\3.'), '..', '.')), 'нет') as operator_name,
  	CASE
		WHEN COALESCE(c.client_survey_comment_positive, '') = '' AND COALESCE(c.client_survey_comment_negative, '') = '' THEN 'нет'
		ELSE ARRAY_TO_STRING(ARRAY[client_survey_comment_positive, client_survey_comment_negative], ' ', '')
	END as comment_client,
	CASE WHEN COALESCE(c.client_survey_comment_positive, '') <> '' OR COALESCE(c.client_survey_comment_negative, '') <> '' THEN 'да' ELSE 'нет' END as comment_client_true_false,
	CASE WHEN c.is_technical THEN 'нет' ELSE COALESCE(c.client_survey_grade::text, 'нет') END as score_client,
	CASE WHEN c.client_survey_grade IS NOT NULL THEN 'да' ELSE 'нет' END as score_client_true_false,
	1 as rn, -- :-)
    s.property_type,
    CASE 
        WHEN c.status = 'талон не был взят' THEN 'СТАТУС НЕ ОПРЕДЕЛЕН'
        WHEN c.status = ANY(ARRAY['не явился по вызову', 'отменено ОИВ', 'отменено пользователем']) THEN 'НЕ СОСТОЯЛОСЬ'
        WHEN c.status = 'обслужен' THEN 'СОСТОЯЛОСЬ'
        ELSE  'ЗАБРОНИРОВАНО'
    END as status_calculate, 
    d.full_name as spr_department_full,
    d.boss_surname || ' ' || d.boss_first_name || ' ' || d.boss_last_name as spr_manager,
    z.surname || ' ' || z.first_name || ' ' || z.last_name as spr_zamestitel,

    COALESCE(c.online_grade, c.client_survey_grade) as grade,
    s.display_name as service_full_name,
    z.full_name as zam_full_name,
    s.slot_group_id as slot_group_id,
    COALESCE(c.operator_survey_consultation_type, 'нет') as consultation_type
FROM vks.cases c 
LEFT JOIN vks.services s ON c.service_id = s.id
LEFT JOIN vks.clients cl ON c.client_id = cl.id
LEFT JOIN vks.departments d ON s.department_id = d.id
LEFT JOIN vks.zams z ON d.zam_id = z.id
ORDER BY c.date DESC, c.id DESC;
----------------------------------------------------------------------
-- ALTER TABLE vks.consultations_legacy_view
--     OWNER TO consultation_legacy;

-- GRANT USAGE ON SCHEMA vks TO consultation_legacy;
-- GRANT SELECT ON TABLE vks.cases TO consultation_legacy;
-- GRANT SELECT ON TABLE vks.clients TO consultation_legacy;
-- GRANT SELECT ON TABLE vks.departments TO consultation_legacy;
-- GRANT SELECT ON TABLE vks.services TO consultation_legacy;
-- GRANT SELECT ON TABLE vks.zams TO consultation_legacy;



-- Консультации - свод по слотам и кварталам
DROP VIEW IF EXISTS vks.quarter_totals CASCADE;
CREATE OR REPLACE VIEW vks.quarter_totals  AS
----------------------------------------------------------------------
WITH totals AS (
    SELECT 
        DATE_PART('year', date)::integer as year,
        DATE_PART('quarter', date)::integer as quarter,
        s.slot_group_id,
        COUNT(*)::integer as total,
        COUNT(*) FILTER(WHERE status = 'обслужен')::integer as served,
        COUNT(*) FILTER(WHERE status = 'отменено ОИВ')::integer as canceled_by_us,
        COUNT(*) FILTER(WHERE status = 'отменено пользователем')::integer as canceled_by_client,
        COUNT(*) FILTER(WHERE status = 'талон не был взят')::integer as missed,
        COUNT(*) FILTER(WHERE status = 'забронировано')::integer as reserved,
        COUNT(*) FILTER(WHERE status = 'не явился по вызову')::integer as not_arrived
    FROM vks.cases c
    LEFT JOIN vks.services s ON c.service_id = s.id
    GROUP BY 
        DATE_PART('year', date),
        DATE_PART('quarter', date),
        s.slot_group_id
)
SELECT 
	g.id as slot_group_id,
	g.full_name,
	g.short_name,
	q.year,
	q.quarter,
	q.year::text || ' год ' || to_char(q.quarter, 'FMRN') || '-й квартал' as period,
	q.slots as slots_avaliable,
	t.total,
	t.served,
	t.canceled_by_us,
	t.canceled_by_client,
	t.missed,
	t.reserved,
	t.not_arrived
FROM vks.quarter_slots q
LEFT JOIN vks.slot_groups g ON g.id = q.slot_group_id
LEFT JOIN totals t ON g.id = t.slot_group_id AND q.year = t.year AND q.quarter = t.quarter
ORDER BY q.year ASC, q.quarter ASC, g.id;