import { z } from 'zod';

export type AnketologSurveyResponse = {
  id: number;
  survey_id: number;
  revision_id: number;
  start_date: number;
  finish_date: number;
  status: string;
  ip_hash: string;
  ua_hash: string;
  respondent: null;
  collector: {
    swagger_type: 'SurveyExtralinkCollector';
    extralink_id: number;
    type: string;
    name: string;
    extralink_title: string;
    extralink_url: string;
    extralink_url_tiny: string;
    is_unique: boolean;
    params: unknown[];
  };
  additional_params: unknown[];
  answer: Array<{
    question_id: number;
    question_type: 'free' | 'select' | 'multiselect' | 'date';
    question_name: string;
    question_answer:
      | {
          swagger_type: 'SurveyReportDetailTextAnswer';
          answer: { answer_text: string };
          answer_unable: boolean;
        }
      | {
          swagger_type:
            | 'SurveyReportDetailSelectAnswer'
            | 'SurveyReportDetailMultiselectAnswer';
          answer: {
            options: Array<{
              option_id: number;
              option_name?: string;
              option_point?: number;
              answer_value: boolean;
              answer_text?: string | null;
            }>;
          };
          answer_unable: boolean;
        };
  }>;
};

export type RawBookingRecord = {
  '№': number;
  Отделение: string;
  'Дата и время создания брони': string;
  'Дата записи': string;
  'Время записи': string;
  Услуга: string;
  Статус: string;
  'Количество дел': string;
  'Тип заявителя': string;
  'Фамилия заявителя': string;
  'Имя заявителя': string;
  'Отчество заявителя': string;
  'Название организации(для юридических лиц)': string;
  'ФИО представителя': string;
  'Код бронирования': string;
  'Запись произведена': string;
  'Ресурс предварительной записи': string;
  'Телефон заявителя/представителя': string;
  'Адрес электронной почты заявителя/представителя': string;
  'СНИЛС заявителя': string;
  'ОГРН (ю.л.)': string;
  'ИНН (ю.л.)': string;
  'Номер талона': string;
  'Время вызова талона': string;
  'Время отмены записи пользователем': string;
  'Время отмены записи ОИВ': string;
  'Дополнительные поля': string;
  booking_id: string;
  'id услуги': string;
};

export const bookingClientSchema = z.object({
  id: z.number().positive().int(),
  type: z.enum(['Физическое лицо', 'Юридическое лицо']),
  Surname: z.string(),
  FirstName: z.string(),
  LastName: z.string(),
  OrgName: z.string(),
  snils: z.string().regex(/^\d{3}-\d{3}-\d{3} \d{2}$/, 'Неверный формат СНИЛС'),
  ogrn: z.string().regex(/^\d+$/, 'Неверный формат ОГРН'),
  inn: z.string().regex(/^\d+$/, 'Неверный формат ИНН'),
});
export type BookingClient = z.infer<typeof bookingClientSchema>;

const bookingRecordSchema = z.object({
  org: z.string(),
  date: z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Неверный формат даты (DD.MM.YYYY)'),
  time: z
    .string()
    .regex(
      /^\d{2}:\d{2}:\d{2}-\d{2}:\d{2}:\d{2}$/,
      'Неверный формат времени (HH:MM:SS-HH:MM:SS)',
    ),
  serviceId: z.number().int().positive(),
  serviceName: z.string(),
  status: z.string(),
  caseCount: z.number().int().nonnegative(),
  bookingId: z.number().int().nonnegative(),
  bookingDate: z
    .string()
    .regex(
      /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}$/,
      'Неверный формат даты и времени',
    ),
  bookingCode: z.string(),
  bookingSource: z.string(),
  bookingResource: z.string(),
  deputyFio: z.string(),
  phone: z.string(),

  email: z.string(),
  tikenNum: z.string(),
  tiketCallTime: z.string(),
  tiketCancelUserTime: z.string(),
  tiketCancelOivTime: z.string(),

  problemAudio: z.string(),
  problemVideo: z.string(),
  problemConnection: z.string(),
  problemTech: z.string(),
  vksSearchSpeed: z.string(),
  onlineGrade: z.string(),
  onlineGradeComment: z.string(),
  operatorLink: z.union([z.string().url('Invalid URL format'), z.literal('-')]),
  participantFio: z.string(),
  problemSummary: z.string(),
  address: z.string(),
  contractNumber: z.string(),
  letterNumber: z.string(),
  flsNumber: z.string(),
  clientId: z.number().int().nonnegative(),
});
export type BookingRecord = z.infer<typeof bookingRecordSchema>;

// {
//     org: r?.['Отделение'],
//     reserveDate: r?.['Дата и время создания брони'],
//     date: r?.['Дата записи'],
//     time: r?.['Время записи'],

//     serviceId: r?.['id услуги'],
//     serviceName: r?.['Услуга'],

//     status: r?.['Статус'],
//     caseCount: parseInt(r?.['Количество дел'] || '0'),
//     clientType: r?.['Тип заявителя'],

//     Surname: r?.['Фамилия заявителя'],
//     FirstName: r?.['Имя заявителя'],
//     LastName: r?.['Отчество заявителя'],

//     OrgName: r?.['Название организации(для юридических лиц)'],
//     deputyFio: r?.['ФИО представителя'],

//     reserveCode: r?.['Код бронирования'],
//     reserveSource: r?.['Запись произведена'],
//     reserveResource: r?.['Ресурс предварительной записи'],

//     phone: r?.['Телефон заявителя/представителя'],
//     email: r?.['Адрес электронной почты заявителя/представителя'],

//     snils: r?.['СНИЛС заявителя'],
//     ogrn: r?.['ОГРН (ю.л.)'],
//     inn: r?.['ИНН (ю.л.)'],

//     tikenNum: r?.['Номер талона'],
//     tiketCallTime: r?.['Время вызова талона'],
//     tiketCancelUserTime: r?.['Время отмены записи пользователем'],
//     tiketCancelOivTime: r?.['Время отмены записи ОИВ'],
//     tiketAdditionalFields: r?.['Дополнительные поля'],
//     bookingId: r?.['booking_id'],
//   };

// const data = {
//   '№': 1,
//   Отделение: 'Департамент городского имущества города Москвы',
//   'Дата и время создания брони': '25.07.2025 16:32:22',
//   'Дата записи': '29.07.2025',
//   'Время записи': '08:00:00-08:15:00',
//   Услуга:
//     'Онлайн-консультация по вопросу: Подтверждение добровольного согласия на приватизацию жилого помещения (по округу ЮЗАО)',
//   Статус: 'не явился по вызову',
//   'Количество дел': '1',
//   'Тип заявителя': 'Физическое лицо',
//   'Фамилия заявителя': 'Лазариди',
//   'Имя заявителя': 'Лариса',
//   'Отчество заявителя': 'Геннадьевна',
//   'Название организации(для юридических лиц)': '-',
//   'ФИО представителя': '-',
//   'Код бронирования': '0539-7326852',
//   'Запись произведена':
//     'Портал государственных и муниципальных услуг города Москвы',
//   'Ресурс предварительной записи': 'Подтверждение на приватизацию (ЮЗАО)',
//   'Телефон заявителя/представителя': '(916) 196-08-26',
//   'Адрес электронной почты заявителя/представителя': 'lbrad@mail.ru',
//   'СНИЛС заявителя': '047-588-320 95',
//   'ОГРН (ю.л.)': '-',
//   'ИНН (ю.л.)': '-',
//   'Номер талона': '-',
//   'Время вызова талона': '-',
//   'Время отмены записи пользователем': '-',
//   'Время отмены записи ОИВ': '-',
//   'Дополнительные поля':
//     'Адрес объекта приватизации : Подольск, ул. Юбилейная д.3к2, кв16\nСсылка оператора : http://conference.mos.ru/s01-9f5ec656-95a9-4213-9e64-1b4de524ad54',
//   booking_id: '15609850',
//   'id услуги': '1822',
// };
