import {
  RawTeletribeHotlineRecord,
  TeletribeRecord,
} from '@urgp/shared/entities';
import { transformEmptyToNull } from './transformEmptyToNull';
import { strToBool } from './transformStringToBoolen';
import { addSeconds, format, parse } from 'date-fns';

export function formatTeletribeRecord(
  r: RawTeletribeHotlineRecord,
): TeletribeRecord {
  let problems = [];
  if (strToBool(r?.['PER_DAN'])) problems.push('Нужны персональные данные');
  if (strToBool(r?.['VNE_COMP'])) problems.push('Вне компетенции');
  if (strToBool(r?.['OBR_CALL'])) problems.push('Обратный звонок');
  if (strToBool(r?.['PRICH'])) problems.push('Консультация прервана');
  if (strToBool(r?.['SVO'])) problems.push('Участник СВО');
  if (strToBool(r?.['FAMILY_SVO'])) problems.push('Член семьи СВО');

  const duration = parseInt(r?.['SPEAKINGTIME_OP'] || '0');

  const baseDate = parse(r?.['CALL_TIME'], 'HH:mm:ss', new Date());
  const endTime = isNaN(baseDate.getTime())
    ? r?.['SPEAKINGTIME_OP'] || '00:00:00'
    : format(addSeconds(baseDate, duration), 'HH:mm:ss');

  return transformEmptyToNull({
    case_type: 'ГЛ',
    booking_source: 'Горячая линия',
    booking_resource: 'Консультация по ГЛ (Teletribe)',
    service_id: -100,
    operator_survey_consultation_type: 'По телефону',

    status: duration > 0 ? 'обслужен' : 'не явился по вызову',

    booking_code: r?.['SESSION_ID'] || '0',
    phone: r?.['ABONENT'] || '',
    teletribe_dst: r?.['DST'] || '01.01.2026',
    date: r?.['CALL_DATE'] || '01.01.2026',
    time: `${r?.['CALL_TIME']}-${endTime}` || '00:00:00-00:00:00',
    consultation_duration: duration,
    wait_duration: parseInt(r?.['WAITTIME'] || '0'),
    hold_count: parseInt(r?.['CNT_HOLD_ALL'] || '0'),
    hold_duration: parseInt(r?.['HOLD_TIME'] || '0'),
    teletribe_user_login: r?.['OP_LOGIN'] || '',
    operator_survey_fio: r?.['FIO_OP'] || '',
    problem_summary: r?.['TEMA_VOPROSA'] || '',
    operator_survey_is_client: strToBool(r?.['CLIENT_SKR']),
    operator_survey_address: r?.['REG'] || '',
    operator_survey_relation: r?.['MSC'] || '',
    operator_survey_doc_type: r?.['QUEST'] || '',
    operator_survey_doc_date: r?.['DATE_DOC'] || '',
    operator_survey_doc_num: r?.['NUM_DOC'] || '',
    operator_survey_department: r?.['UPR'] || '',
    operator_survey_info_source: r?.['Q_111'] || '',
    operator_survey_summary: r?.['OP_VOP'] || '',
    operator_survey_question_type: r?.['HAR_VOP'] || '',
    operator_survey_sent_to_yandex: strToBool(r?.['YANDEX']),
    teletribe_disconnect_details: r?.['IF_DA'] || '',
    teletribe_disconnect_initiator: r?.['FLG_CALL_DISCONNECTION'] || '',
    teletribe_sound_link: (r?.['SOUND'] || '').match(/href=\\"(.*?)\\"/),
    operator_survey_problems: problems,
    client_id: parseInt(
      (r?.['ABONENT']?.length >= 10
        ? '3' + r?.['ABONENT'] || ''
        : '4' + r?.['SESSION_ID']?.match(/\d/g)?.join('')
      ).slice(-15) || '',
    ),
  }) as TeletribeRecord;
}
