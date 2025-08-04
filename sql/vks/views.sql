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
                OR array_length(array_remove(c.operator_survey_problems, 'Проблем не обнаружено!'), 1) > 0) 
            THEN true 
            ELSE false 
        END as "hasTechnicalProblems",
        c.is_technical as "isTechnical",
        CASE 
            WHEN c.client_survey_grade IS NOT NULL THEN 'survey'
            WHEN c.online_grade IS NOT NULL THEN 'online'
            ELSE 'none'
        END as "gradeSource",
        COALESCE(c.client_survey_grade, c.online_grade) as grade,
        -- COALESCE(COALESCE(c.client_survey_comment_positive, '') || COALESCE(c.client_survey_comment_negative, ''), c.online_grade_comment) as "gradeComment",
        c.client_id as "clientId",
        COALESCE(c.participant_fio, CASE WHEN cl.short_name = 'Организация' THEN null ELSE cl.full_name END, c.deputy_fio ) as "clientFio",
        cl.type as "clientType",
        c.operator_survey_fio as "operatorFio",

        
        c.operator_survey_date as "operatorSurveyDate",
        c.client_survey_date as "clientSurveyDate"

    FROM vks.cases c
    LEFT JOIN vks.clients cl ON cl.id = c.client_id
    LEFT JOIN vks.services s ON c.service_id = s.id
    LEFT JOIN vks.departments d ON s.department_id = d.id
    LEFT JOIN vks.zams z ON d.zam_id = z.id
    ORDER BY c.date DESC NULLS LAST, c.time DESC NULLS LAST, c.id DESC NULLS LAST;
----------------------------------------------------------------------
ALTER TABLE vks.cases_slim_view
    OWNER TO renovation_user;



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
                OR array_length(array_remove(c.operator_survey_problems, 'Проблем не обнаружено!'), 1) > 0) 
            THEN true 
            ELSE false 
        END as "hasTechnicalProblems",
        c.is_technical as "isTechnical",
        CASE 
            WHEN c.client_survey_grade IS NOT NULL THEN 'survey'
            WHEN c.online_grade IS NOT NULL THEN 'online'
            ELSE 'none'
        END as "gradeSource",
        COALESCE(c.client_survey_grade, c.online_grade) as grade,
        -- COALESCE(COALESCE(c.client_survey_comment_positive, '') || COALESCE(c.client_survey_comment_negative, ''), c.online_grade_comment) as "gradeComment",
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
		
		c.operator_survey_consultation_type as "operatorSurveyConsultationType",
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
		
		s.full_name as "serviceFullName",
		d.full_name as "departmentFullName",
		z.full_name as "zamFullName",
		
		COALESCE(COALESCE(c.client_survey_comment_positive, '') || COALESCE(c.client_survey_comment_negative, ''), c.online_grade_comment) as "gradeComment"
		

    FROM vks.cases c
    LEFT JOIN vks.clients cl ON cl.id = c.client_id
    LEFT JOIN vks.services s ON c.service_id = s.id
    LEFT JOIN vks.departments d ON s.department_id = d.id
    LEFT JOIN vks.zams z ON d.zam_id = z.id;
----------------------------------------------------------------------
ALTER TABLE vks.cases_detailed_view
    OWNER TO renovation_user;