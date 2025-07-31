import { AnketologSurveyResponse } from '@urgp/shared/entities';
import { getSurveyAnswer } from './getSurveyAnswer';
import { transformEmptyToNull } from './transformEmptyToNull';
import { Logger } from '@nestjs/common';

export const operatorSurveyQuestions = {
  10500176: 'operatorFio',
  2377: 'consultationType',
  4500: 'isHousingQuestion',
  4191: 'isClient',
  4194: 'registrationAddress',
  4195: 'relationsToMoscow',
  2404: 'documentType',
  2409: 'documentDate',
  2410: 'documentNumber',
  2948: 'department',
  4451: 'questionSummary',
  4201: 'mood',
  10502178: 'needsAnswer',
  10500170: 'problems',
  10502512: 'informationSource',
};

export function formatOperatorSurvey(s: AnketologSurveyResponse): any {
  return transformEmptyToNull({
    id: s?.id,
    surveyId: s?.survey_id,
    date: new Date(s?.start_date * 1000).toLocaleString('ru-Ru'),
    status: s?.status,
    bookingCode: s?.collector?.extralink_title,
    extralinkId: s?.collector?.extralink_id,
    extralinkUrl: s?.collector?.extralink_url,
    // deleteMe: s?.answer?.find(
    //   (a) => a?.question_id && a.question_id === 10500170,
    // ),
    ...s?.answer?.reduce(
      (obj, ans) => {
        const questionName =
          operatorSurveyQuestions[
            ans?.question_id as keyof typeof operatorSurveyQuestions
          ];
        if (!questionName) return obj;
        const surveyAnswer = getSurveyAnswer(ans);

        if (
          ['isHousingQuestion', 'isClient', 'needsAnswer'].includes(
            questionName,
          )
        ) {
          return {
            ...obj,
            [questionName]:
              surveyAnswer === 'Да'
                ? true
                : surveyAnswer === 'Нет'
                  ? false
                  : null,
          };
        }

        return {
          ...obj,
          [questionName]: surveyAnswer,
        };
      },
      {
        operatorFio: '-',
        consultationType: '-',
        isHousingQuestion: '-',
        isClient: '-',
        registrationAddress: '-',
        relationsToMoscow: '-',
        documentType: '-',
        documentDate: '-',
        documentNumber: '-',
        department: '-',
        questionSummary: '-',
        mood: '-',
        needsAnswer: '-',
        problems: [],
        informationSource: '-',
      },
    ),
  });
}
