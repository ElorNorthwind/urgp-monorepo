export type ResolutionData = Record<string, ResolutionOrderData[]>;

export type ResolutionOrderData = Record<string, ResolutionOrderUserData>;

export type ResolutionOrderUserData = {
  r_id: number; // 672326216
  is_sp: 0 | 1; // 0
  n: 0 | 1; // 0
  rt_id: number; // 1216631054
  primary_id: number | null; // null
  plus: 0 | 1; // 0
  ordi: 0 | 1; // 0
  is_control: 0 | 1; // 0
  unset_control: 0 | 1; // 0
  another_control: 0 | 1; // 1
  presidential_control: any | null; // null
  responsibility: string | null; // ''
  resolution_r_list_id: any | null; // null
  is_resp: 0 | 1; // 0
  exec_flag: 0 | 1; // 0
  exec_date: Date | null; // '2023-10-03 00:00:00'
  acting_author: any | null; // null
  acting_disable: 0 | 1; // 0
  acting_user_id: number | null; // null
  acting_post_hier: any | null; // null
  acting_send_user_id: any | null; // null
  rrl_name: any | null; // null
  phone_number: string | null; // ''
  user_id: number | null; // 1558294
  ua_name: string | null; // 'Гаман М.Ф.'
  group_id: number | null; // 21
  ua_genitive_post: string | null; // 'Министра Правительства Москвы, руководителя Департамента городского имущества г. Москвы'
  ua_post: string | null; // 'Министр Правительства Москвы, руководитель Департамента городского имущества г. Москвы'
  ua_dative_name: string | null; // 'Гаману М.Ф.'
  ua_accusative_name: string | null; // 'Гамана М.Ф.'
  dative_post: string | null; // 'Министру Правительства Москвы, руководителю Департамента городского имущества г. Москвы'
  group_name: string | null; // 'Департамент городского имущества города Москвы'
  group_phone: string | null; // '8(495) 777-77-77'
  uaa_name: any | null; // null
  uaa_genitive_post: any | null; // null
  uaa_dative_name: any | null; // null
  ro_id: number; // 706142464
  r_to_urgency: 0 | 1; // 0
  id: number; // 1558294
  name: string | null; // 'Гаман М.Ф.'
  dative_name: string | null; // 'Гаману М.Ф.'
};
