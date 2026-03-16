import {
  RawTeletribeHotlineRecord,
  RawTeletribeScoreRecord,
  TeletribeScore,
} from '@urgp/shared/entities';
import { transformEmptyToNull } from './transformEmptyToNull';
import { date } from 'zod';

export function formatTeletribeScore(
  r: RawTeletribeScoreRecord,
): TeletribeScore {
  const rating =
    typeof r?.['RATING_1_QUESTION'] === 'number'
      ? r?.['RATING_1_QUESTION']
      : parseInt(r?.['RATING_1_QUESTION'] || '0');

  return transformEmptyToNull({
    booking_code: r?.['SESSION_ID'] || '0',
    date: r?.['CALL_DATE_TIME']?.slice(0, 10) || '01.01.2026',
    online_grade: Number.isInteger(rating) ? rating : null,
    online_grade_comment: r?.['TEXT_2_QUESTION'] || '',
  }) as TeletribeScore;
}
