import {
  RawTeletribeHotlineRecord,
  TeletribeClient,
} from '@urgp/shared/entities';
import { transformEmptyToNull } from './transformEmptyToNull';

export function formatTeletribeClient(
  r: RawTeletribeHotlineRecord,
): TeletribeClient {
  const clientIdStr = (
    r?.['ABONENT']?.length >= 10
      ? '3' + r?.['ABONENT'] || ''
      : '4' + r?.['SESSION_ID']?.match(/\d/g)?.join('')
  ).slice(-15);
  const clientId = Number.isInteger(parseInt(clientIdStr || '0'))
    ? parseInt(clientIdStr || '0')
    : 0;

  return transformEmptyToNull({
    type: 'Телефонный звонок',
    id: clientId,
    surname: r?.['FIO'] || 'Аноним',
  }) as TeletribeClient;
}
