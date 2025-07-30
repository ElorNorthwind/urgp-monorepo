import { AnketologSurveyResponse } from '@urgp/shared/entities';
import { getSurveyAnswer } from './getSurveyAnswer';

export const clientSurveyQuestions = {
  10501053: 'operatorJoined',
  10501054: 'consultationReceived',
  10501216: 'operatorGrade',
  10501056: 'comment',
  10501217: 'comment2',
};

export function formatClientSurvey(s: AnketologSurveyResponse): any {
  return {
    id: s?.id,
    surveyId: s?.survey_id,
    date: new Date(s?.start_date * 1000).toLocaleString('ru-Ru'),
    status: s?.status,
    bookingCode: s?.collector?.extralink_title,
    extralinkId: s?.collector?.extralink_id,
    extralinkUrl: s?.collector?.extralink_url,

    ...s?.answer?.reduce(
      (obj, ans) => {
        const questionName =
          clientSurveyQuestions[
            ans?.question_id as keyof typeof clientSurveyQuestions
          ];
        if (!questionName) return obj;
        return {
          ...obj,
          [questionName]: getSurveyAnswer(ans),
        };
      },
      {
        operatorJoined: '-',
        consultationReceived: '-',
        operatorGrade: '-',
        comment: '-',
        comment2: '-',
      },
    ),
  };
}
