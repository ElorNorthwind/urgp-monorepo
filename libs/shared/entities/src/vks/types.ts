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
          swagger_type: 'SurveyReportDetailScaleAnswer';
          answer: {
            ranges: Array<{
              range_id: number;
              options: Array<{
                option_id: number;
                option_name?: string;
                answer_value: boolean;
              }>;
            }>;
          };
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
  Surname: z.string().nullable(),
  FirstName: z.string().nullable(),
  LastName: z.string().nullable(),
  OrgName: z.string().nullable(),
  snils: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{3} \d{2}$/, 'Неверный формат СНИЛС')
    .nullable(),
  ogrn: z.string().regex(/^\d+$/, 'Неверный формат ОГРН').nullable(),
  inn: z.string().regex(/^\d+$/, 'Неверный формат ИНН').nullable(),
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
  caseCount: z.number().int().nonnegative().default(0),
  bookingId: z.number().int().nonnegative(),
  bookingDate: z
    .string()
    .regex(
      /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}$/,
      'Неверный формат даты и времени',
    ),
  bookingCode: z.string(),
  bookingSource: z.string().nullable(),
  bookingResource: z.string().nullable(),

  deputyFio: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  tikenNum: z.string().nullable(),
  tiketCallTime: z.string().nullable(),
  tiketCancelUserTime: z.string().nullable(),
  tiketCancelOivTime: z.string().nullable(),

  problemAudio: z.string().nullable(),
  problemVideo: z.string().nullable(),
  problemConnection: z.string().nullable(),
  problemTech: z.string().nullable(),
  vksSearchSpeed: z.string().nullable(),
  onlineGrade: z.string().nullable(),
  onlineGradeComment: z.string().nullable(),
  operatorLink: z.string().url('Invalid URL format').nullable(),
  participantFio: z.string().nullable(),
  problemSummary: z.string().nullable(),
  address: z.string().nullable(),
  contractNumber: z.string().nullable(),
  letterNumber: z.string().nullable(),
  flsNumber: z.string().nullable(),

  clientId: z.number().int().nonnegative(),
});
export type BookingRecord = z.infer<typeof bookingRecordSchema>;

const surveyResponseSchema = z.object({
  id: z.number(),
  surveyId: z.number(),
  date: z.string().regex(/^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}:\d{2}$/),
  status: z.string().length(1),
  bookingCode: z.string().regex(/^\d{4}-\d{7}$/),
  extralinkId: z.number(),
  extralinkUrl: z.string().url(),
});

const operatorSurveyResponseSchema = surveyResponseSchema.extend({
  operatorFio: z.string().nullable(),
  consultationType: z.string().nullable(),
  isHousingQuestion: z.coerce.boolean().nullable(),
  isClient: z.coerce.boolean().nullable(),
  registrationAddress: z.string().nullable(),
  relationsToMoscow: z.string().nullable(),
  documentType: z.string().nullable(),
  documentDate: z.string().nullable(),
  documentNumber: z.string().nullable(),
  department: z.string().nullable(),
  questionSummary: z.string().nullable(),
  mood: z.string().nullable(),
  needsAnswer: z.coerce.boolean().nullable(),
  problems: z.array(z.string()),
  informationSource: z.string(),
});
export type OperatorSurveyResponse = z.infer<
  typeof operatorSurveyResponseSchema
>;

const clientSurveyResponseSchema = surveyResponseSchema.extend({
  operatorJoined: z.coerce.boolean().nullable(),
  consultationReceived: z.coerce.boolean().nullable(),
  operatorGrade: z.coerce.number().int().nonnegative().nullable(),
  commentPositive: z.string().nullable(),
  commentNegative: z.string().nullable(),
});
export type ClientSurveyResponse = z.infer<typeof clientSurveyResponseSchema>;

export const vksCaseSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  date: z.string().datetime(), // ISO 8601 date string
  time: z
    .string()
    .regex(
      /^\d{2}:\d{2}:\d{2}-\d{2}:\d{2}:\d{2}$/,
      'Неверный формат времени (HH:MM:SS-HH:MM:SS)',
    ),
  serviceId: z.coerce.number().int().nonnegative(),
  serviceName: z.string().nullable(),
  propertyType: z.string().nullable(),
  departmentId: z.coerce.number().int().nonnegative().nullable(),
  departmentName: z.string().nullable(),
  zamId: z.coerce.number().int().nonnegative(),
  zamName: z.string().nullable(),
  status: z.string(),
  bookingCode: z.string().nullable(),
  bookingSource: z.enum(['Онлайн', 'Календарь', 'Портал ГУ', 'Иной']),
  hasTechnicalProblems: z.boolean(),
  isTechnical: z.boolean(),
  gradeSource: z.enum(['survey', 'online', 'none']),
  grade: z.number().nullable(),
  clientId: z.coerce.number().int().nonnegative(),
  clientFio: z.string().nullable(),
  clientType: z
    .enum([
      'Физическое лицо',
      'Индивидуальный предприниматель',
      'Юридическое лицо',
    ])
    .nullable(),
  operatorFio: z.string().nullable(),
  operatorSurveyDate: z.string().datetime().nullable(), // ISO 8601 date string
  clientSurveyDate: z.string().datetime().nullable(), // ISO 8601 date string
});
export type VksCase = z.infer<typeof vksCaseSchema>;

export const VksCaseDetailsSchema = vksCaseSchema.extend({
  bookingId: z.coerce.number().int().nonnegative().nullable(),
  bookingDate: z.string().datetime().nullable(), // ISO 8601 date string
  bookingResource: z.string().nullable(),
  deputyFio: z.string().nullable(),
  participantFio: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),

  problemAudio: z.string().nullable(),
  problemVideo: z.string().nullable(),
  problemConnection: z.string().nullable(),
  problemTech: z.string().nullable(),
  vksSearchSpeed: z.string().nullable(),
  operatorLink: z.string().nullable(),
  problemSummary: z.string().nullable(),
  privatizationAddress: z.string().nullable(),
  contractNumber: z.string().nullable(),
  letterNumber: z.string().nullable(),
  flsNumber: z.string().nullable(),

  operatorSurveyId: z.coerce.number().int().nonnegative().nullable(),
  operatorSurveyStatus: z.string().nullable(),
  operatorSurveyExtralinkId: z.coerce.number().int().nonnegative().nullable(),
  operatorSurveyExtralinkUrl: z.string().url().nullable(),

  operatorSurveyConsultationType: z.string().nullable(),
  operatorSurveyIsHousing: z.coerce.boolean().nullable(),
  operatorSurveyIsClient: z.coerce.boolean().nullable(),
  operatorSurveyAddress: z.string().nullable(),
  operatorSurveyRelation: z.string().nullable(),
  operatorSurveyDocType: z.string().nullable(),
  operatorSurveyDocDate: z.string().nullable(),
  operatorSurveyDocNum: z.string().nullable(),
  operatorSurveyDepartment: z.string().nullable(),
  operatorSurveySummary: z.string().nullable(),
  operatorSurveyMood: z.string().nullable(),
  operatorSurveyNeedsAnswer: z.coerce.boolean().nullable(),
  operatorSurveyProblems: z.array(z.string()).nullable(),
  operatorSurveyInfoSource: z.string().nullable(),

  clientSurveyId: z.coerce.number().int().nonnegative().nullable(),
  clientSurveyStatus: z.string().nullable(),
  clientSurveyExtralinkId: z.coerce.number().int().nonnegative().nullable(),
  clientSurveyExtralinkUrl: z.string().url().nullable(),
  clientSurveyJoined: z.coerce.boolean().nullable(),
  clientSurveyConsultationReceived: z.coerce.boolean().nullable(),

  serviceFullName: z.string().nullable(),
  departmentFullName: z.string().nullable(),
  zamFullName: z.string().nullable(),
  gradeComment: z.string().nullable(),
});
export type VksCaseDetails = z.infer<typeof VksCaseDetailsSchema>;

export type vksUpdateQueryReturnValue = {
  qms: { clients: number; records: number };
  operator: { found: number; updated: number };
  client: { found: number; updated: number };
};
