import {
  AnketologSurveyResponse,
  ClientSurveyResponse,
  OperatorSurveyResponse,
} from '@urgp/shared/entities';
import { AnketologSurveyTypes } from 'libs/shared/entities/src/vks/config';
import { formatOperatorSurvey } from './formatOperatorSurvey';
import { formatClientSurvey } from './formatClientSurvey';

export function formatSurvey(
  surveys: AnketologSurveyResponse[],
  surveyId: number,
): OperatorSurveyResponse[] | ClientSurveyResponse[] {
  return surveyId === AnketologSurveyTypes.operator
    ? surveys?.map((r: AnketologSurveyResponse) => formatOperatorSurvey(r))
    : surveys?.map((r: AnketologSurveyResponse) => formatClientSurvey(r));
}
