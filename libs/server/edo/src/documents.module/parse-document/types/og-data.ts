interface OgQuestion {
  id: number; // any | null //  65747086
  document_id: number; // any | null // 504105934
  n: number; // 1
  theme_id: number | null; // 24672
  kind_ref_id: number | null; // 5
  category: number | null; // 2
  annotation: string | null; // 'ДГИ-260994/23-(0)-0 БУРМИНОВА Н.С.\r\nпо жилищному вопросу'
  responsible_org_id: any | null; // null
  coordinating_org_id: any | null; // null
  controlling_org_id: any | null; // null
  explaining_org_id: any | null; // null
  prev_appeal: any | null; // null
  type_replication: number | null; // 1
  reply_document_id: any | null; // null
  reply_author_document_id: any | null; // null
  solved: any | null; // null
  remark: any | null; // null
  validity_ref_id: number | null; // 2
  result_ref_id: number | null; // 3
  reason_ref_id: any | null; // null
  date_answer: any | null; // ''
  og_classifier_id: any | null; // null
  type_kind_ref_id: any | null; // null
  og_object_ref_id: any | null; // null
  execution: any | null; // 1
  sent_message_paper: any | null; // false
  sent_message_email: any | null; // false
  sentence_sequence: number | null; // 0
  og_question_object_id: any | null; // null
  og_cause_of_discontent_ref_id: any | null; // null
  apartment: any | null; // null
  theme_path: string | null; // 'Жилищная политика / Предоставление жилых помещений без приобретения права собственности / Улучшение жилищных условий граждан (без конкретики)'
  theme_path_portal: string | null; // 'Жилищная политика / Предоставление жилых помещений без приобретения права собственности / Улучшение жилищных условий граждан (без конкретики)'
  type_replication_name: string | null; // 'Повторное'
  theme_name: string | null; // 'Улучшение жилищных условий граждан (без конкретики)'
  archive: boolean | null; // false
  kind_name: string | null; // 'Заявление – просьба'
  type_kind_name: any | null; // null
  og_object_ref_name: any | null; // null
  og_cause_of_discontent_ref_name: any | null; // null
  reason_name: any | null; // null
  result_name: string | null; // 'Разъяснено'
  validity_name: string | null; // 'Не обоснован'
  date_answer_access: number | null; // 0
  execution_name: string | null; // 'исполнение'
  enable_send_execution: boolean | null; // false
  can_exec: number | null; // 1
  object: any | null; // null
  sentences: any[] | null; // []
  action: any | null; // null
  errors: any[] | null; // []
  access: any | null; // {org_exec_date: 1};
}

interface OgAuthor {
  id: number; // 195114652
  document_id: number; // 504105934
  n: number; // 0
  fn: string | null; // null
  ln: string | null; // 'БУРМИНОВА Н.С.'
  pn: string | null; // null
  region_id: any | null; // null
  country_id: number | null; // 7412
  republic_id: number | null; // 2755
  republic_area_id: any | null; // null
  city_id: number | null; // 3541
  district_id: number | null; // 90
  author_type_id: number | null; // 3
  street: string | null; // 'ул. Годовикова'
  house: string | null; // '7'
  building: string | null; // null
  apartment: string | null; // '15'
  zip: string | null; // '129085'
  phone: string | null; // null
  email: string | null; // null
  c_signatures: any | null; // null
  plain_region: any | null; // null
  plain_city: any | null; // null
  global_id: any | null; // null
  structure: any | null; // null
  adistrict: any | null; // null
  address_raw: any | null; // null
  cdate: any | null; // null
  social_group_id: any | null; // null
  privileged_id: any | null; // null
  adistrict_id: number | null; // 2
  social_group_ref_id: number | null; // 1
  privileged_ref_id: number | null; // 1
  birthday: string | null; // ''
  is_author: number | null; // 1
  is_subject: number | null; // 0
  fio_dative: any | null; // null
  notified_by_email: any | null; // null
  authentication: any | null; // null
  street_id: number | null; // 7720
  street_name: string | null; // 'ул. Годовикова'
  author_type_name: string | null; // 'Физическое лицо'
  country_name: string | null; // 'Российская Федерация'
  republic_name: string | null; // 'г.Москва'
  republic_area_name: string | null; // ''
  city_name: string | null; // 'Москва'
  district_name: string | null; // 'Останкинский'
  adistrict_name: string | null; // 'Северо-Восточный административный округ'
  social_group_name: string | null; // 'Не установлено'
  privileged_name: string | null; // 'Не установлен'
  role: string | null; // 'автор'
  address_fields_changed: number | null; // 0
}

export interface OgData {
  id: number | null; // 219911945
  subject_id: any | null; // null
  kind_id: any | null; // null
  enclosure_id: any | null; // null
  social_group_id: any | null; // null
  privileged_id: any | null; // null
  og_date: any | null; // null
  first_document_id: any | null; // null
  file_number: any | null; // null
  document_id: number | null; // 504105934
  lang_id: any | null; // null
  prav_id: any | null; // null
  event_id: any | null; // null
  global_id: any | null; // null
  prev_appeal: any | null; // null
  result: number | null; // 0
  reason_return: number | null; // 0
  participation: any | null; // null
  with_onsite: any | null; // null
  commission: any | null; // null
  punished: number | null; // 0
  checked: any | null; // null
  type_replications: number | null; // 1
  num_registered_letter: any | null; // null
  message_email: any | null; // null
  message_paper: any | null; // null
  count_signatures: number | null; // 1
  request_data: string | null; // ''
  kind_type_id: any | null; // null
  cant_solve_problem: number | null; // 0
  signed_act_received: number | null; // 0
  postponed_date: any | null; // null
  treatment_type: number | null; // 0
  is_unsended: any | null; // null
  annotations: string | null; // 'Вопрос 1. ДГИ-260994/23-(0)-0 БУРМИНОВА Н.С.\r\nпо жилищному вопросу'
  additional_budget_financing: number | null; // 0

  questions: OgQuestion[];
  authors: OgAuthor[];
  access: any | null; // я хз что тут.
  address_fields_changed: number | null;
}
