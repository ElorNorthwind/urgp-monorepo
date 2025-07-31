
-- Updated at on row modification
CREATE OR REPLACE FUNCTION vks.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at_trigger
BEFORE UPDATE ON vks.clients
FOR EACH ROW
EXECUTE FUNCTION vks.update_updated_at_column();

CREATE TRIGGER cases_updated_at_trigger
BEFORE UPDATE ON vks.cases
FOR EACH ROW
EXECUTE FUNCTION vks.update_updated_at_column();


-- UPDATE vks.cases
-- SET 
-- "operator_survey_id" = null,
-- "operator_survey_date" = null,
-- "operator_survey_status" = null,
-- "operator_survey_extralink_id" = null,
-- "operator_survey_extralink_url" = null,
-- "operator_survey_fio" = null,
-- "operator_survey_consultation_type" = null,
-- "operator_survey_is_housing" = null,
-- "operator_survey_is_client" = null,
-- "operator_survey_address" = null,
-- "operator_survey_relation" = null,
-- "operator_survey_doc_type" = null,
-- "operator_survey_doc_date" = null,
-- "operator_survey_doc_num" = null,
-- "operator_survey_department" = null,
-- "operator_survey_summary" = null,
-- "operator_survey_mood" = null,
-- "operator_survey_needs_answer" = null,
-- "operator_survey_problems" = null,
-- "operator_survey_info_source" = null,
-- "client_survey_id" = null,
-- "client_survey_date" = null,
-- "client_survey_status" = null,
-- "client_survey_extralink_id" = null,
-- "client_survey_extralink_url" = null,
-- "client_survey_joined" = null,
-- "client_survey_consultation_received" = null,
-- "client_survey_grade" = null,
-- "client_survey_comment_positive" = null,
-- "client_survey_comment_negative" = null