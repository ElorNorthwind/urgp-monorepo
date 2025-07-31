import { AnketologSurveyResponse } from '@urgp/shared/entities';

export function getSurveyAnswer(
  answer: AnketologSurveyResponse['answer'][number],
): string | string[] {
  if (
    answer?.question_answer?.swagger_type === 'SurveyReportDetailTextAnswer'
  ) {
    return answer?.question_answer?.answer?.answer_text || '-';
  }

  if (
    answer?.question_answer?.swagger_type === 'SurveyReportDetailScaleAnswer'
  ) {
    return (
      answer?.question_answer?.answer?.ranges?.[0]?.options?.find(
        (o) => o?.answer_value,
      )?.option_name || '-'
    );
  }

  if (
    answer?.question_answer?.swagger_type === 'SurveyReportDetailSelectAnswer'
  ) {
    return (
      answer?.question_answer?.answer?.options?.find((o) => o?.answer_value)
        ?.option_name || '-'
    );
  }

  if (
    answer?.question_answer?.swagger_type ===
    'SurveyReportDetailMultiselectAnswer'
  ) {
    return answer?.question_answer?.answer?.options
      ?.filter((o) => o?.answer_value)
      ?.map((o) => o?.option_name || '-');
  }

  return '-';
}
