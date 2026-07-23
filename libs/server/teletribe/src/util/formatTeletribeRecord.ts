import {
  RawTeletribeHotlineRecord,
  TeletribeRecord,
} from '@urgp/shared/entities';
import { transformEmptyToNull } from './transformEmptyToNull';
import { strToBool } from './transformStringToBoolen';
import { addSeconds, format, parse } from 'date-fns';
import { Logger } from '@nestjs/common';

export function formatTeletribeRecord(
  r: RawTeletribeHotlineRecord,
): TeletribeRecord {
  let problems = [];
  if (strToBool(r?.['PERS_DANNYE'])) problems.push('Нужны персональные данные');
  if (strToBool(r?.['VOPROS_NE_V_KOMPETENCII']))
    problems.push('Вне компетенции');
  if (strToBool(r?.['OBRATNIY_ZVONOK'])) problems.push('Обратный звонок');
  if (strToBool(r?.['DOSROCHNOE_PREKRASCHENIE']))
    problems.push('Консультация прервана');
  if (strToBool(r?.['UCHASTNIK_SVO'])) problems.push('Участник СВО');
  if (strToBool(r?.['CHLEN_SEMYI_SVO'])) problems.push('Член семьи СВО');

  const duration =
    typeof r?.['SPEAKINGTIME_OP'] === 'number'
      ? r?.['SPEAKINGTIME_OP']
      : parseInt(r?.['SPEAKINGTIME_OP'] || '0');

  const waitDuration =
    typeof r?.['WAITTIME'] === 'number'
      ? r?.['WAITTIME']
      : parseInt(r?.['WAITTIME'] || '0');

  const holdCount =
    typeof r?.['CNT_HOLD_ALL'] === 'number'
      ? r?.['CNT_HOLD_ALL']
      : parseInt(r?.['CNT_HOLD_ALL'] || '0');

  const holdDuration =
    typeof r?.['HOLD_TIME'] === 'number'
      ? r?.['HOLD_TIME']
      : parseInt(r?.['HOLD_TIME'] || '0');

  const baseDate = parse(r?.['CALL_TIME'], 'HH:mm:ss', new Date());
  const endTime = isNaN(baseDate.getTime())
    ? r?.['SPEAKINGTIME_OP'] || '00:00:00'
    : format(addSeconds(baseDate, duration), 'HH:mm:ss');

  const clientIdStr = (
    r?.['ABONENT']?.length >= 10
      ? '3' + r?.['ABONENT'] || ''
      : '4' + r?.['SESSION_ID']?.match(/\d/g)?.join('')
  ).slice(-15);
  const clientId = Number.isInteger(parseInt(clientIdStr || '0'))
    ? parseInt(clientIdStr || '0')
    : 0;

  return transformEmptyToNull({
    case_type: 'ГЛ',
    booking_source: 'Горячая линия',
    booking_resource: 'Консультация по ГЛ (Teletribe)',
    service_id: -100,
    operator_survey_consultation_type: 'По телефону',

    status: duration > 0 ? 'обслужен' : 'не явился по вызову',

    booking_code: r?.['SESSION_ID'] || '0',
    phone: r?.['ABONENT'] || '',
    teletribe_dst: r?.['LINE_CALL'] || 'неизвестно',
    date: r?.['CALL_DATE'] || '01.01.2026',
    time: `${r?.['CALL_TIME']}-${endTime}` || '00:00:00-00:00:00',
    consultation_duration: Number.isInteger(duration) ? duration : null,
    wait_duration: Number.isInteger(waitDuration) ? waitDuration : null,
    hold_count: Number.isInteger(holdCount) ? holdCount : null,
    hold_duration: Number.isInteger(holdDuration) ? holdDuration : null,
    teletribe_user_login: r?.['USER_LOGIN'] || '',
    operator_survey_fio: r?.['OPERATOR_FIO'] || '',
    problem_summary: r?.['TEMATICA'] || '',
    operator_survey_is_client: strToBool(r?.['KLIENT']),
    operator_survey_address: r?.['ADRES_REGISTRACII'] || '',
    operator_survey_relation: r?.['OTNOSHENIYA_S_MOSKVOY'] || '',
    operator_survey_doc_type: r?.['KAKOY_DOCUMENT'] || '',
    operator_survey_doc_date: r?.['DATA_DOCUMENTA'] || '',
    operator_survey_doc_num: r?.['NOMER_DOCUMENTA'] || '',
    operator_survey_department: r?.['UPRAVLENIE'] || '',
    operator_survey_info_source: r?.['OTKUDA_UZNALI'] || '',
    operator_survey_summary: r?.['OPISANIE_VOPROSA'] || '',
    operator_survey_question_type: r?.['HARAKTER_VOPROSA'] || '',
    operator_survey_sent_to_yandex: strToBool(r?.['OTPRAVLEN_NA_YANDEX']),
    teletribe_disconnect_details: r?.['ESLI_DA'] || '',
    teletribe_disconnect_initiator: r?.['FLG_CALL_DISCONNECTION'] || '',
    teletribe_sound_link: (r?.['SOUND_UUID'] || '').match(/href=\\"(.*?)\\"/),
    operator_survey_problems: problems,
    client_id: clientId,
  }) as TeletribeRecord;
}
