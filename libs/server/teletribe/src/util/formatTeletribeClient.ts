import {
  RawTeletribeHotlineRecord,
  TeletribeClient,
} from '@urgp/shared/entities';
import { transformEmptyToNull } from './transformEmptyToNull';

export function formatTeletribeClient(
  r: RawTeletribeHotlineRecord,
): TeletribeClient {
  return transformEmptyToNull({
    type: 'Телефонный звонок',
    id: parseInt(
      (r?.['ABONENT']?.length >= 10
        ? '3' + r?.['ABONENT'] || ''
        : '4' + r?.['SESSION_ID']?.match(/\d/g)?.join('')
      ).slice(-15) || '',
    ),
    surname: r?.['FIO'] || 'Аноним',
  }) as TeletribeClient;
}
