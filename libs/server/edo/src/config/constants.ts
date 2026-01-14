import { AxiosRequestConfig, ResponseType } from 'axios';

export const EDO_HTTP_OPTIONS = {
  baseURL: 'https://mosedo.mos.ru',
  headers: {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'ru-RU,ru;q=0.9',
    'user-agent':
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded',
  },
  responseType: 'arraybuffer' as ResponseType,
  responseEncoding: 'binary',
  edoUserId: null as number | null,
};

export const edoDocCardFields = {
  '№ документа': {
    label: '№ документа',
    attribute: 'num',
    format: 'text',
    plural: false,
  },
  'дата документа': {
    label: 'дата документа',
    attribute: 'date',
    format: 'date',
    plural: false,
  },
  подпись: {
    label: 'подпись',
    attribute: 'fromUser',
    format: 'user',
    plural: false,
  },
  исполнитель: {
    label: 'исполнитель',
    attribute: 'authorUser',
    format: 'user',
    plural: false,
  },
  'на №': {
    label: 'на №',
    attribute: 'toNum',
    format: 'doclist',
    plural: false,
  },
  'на документ ссылаются': {
    label: 'на документ ссылаются',
    attribute: 'linksFrom',
    format: 'doclist',
    plural: false,
  },
  'связки моей организации': {
    label: 'связки моей организации',
    attribute: 'connections',
    format: 'doclist',
    plural: false,
  },
  'связки, установленные в других организациях': {
    label: 'связки, установленные в других организациях',
    attribute: 'externalConnections',
    format: 'doclist',
    plural: false,
  },
  кому: { label: 'кому', attribute: 'toUser', format: 'user', plural: true },
  'статус документа': {
    label: 'статус документа',
    attribute: 'status',
    format: 'text',
    plural: false,
  },
  'кол-во листов, прил., экз.': {
    label: 'кол-во листов, прил., экз.',
    attribute: 'pages',
    format: 'text',
    plural: false,
  },
  'вид документа': {
    label: 'вид документа',
    attribute: 'type',
    format: 'text',
    plural: false,
  },
  'вид доставки': {
    label: 'вид доставки',
    attribute: 'deliveryType',
    format: 'text',
    plural: false,
  },
  'вид документа по особым признакам': {
    label: 'вид документа по особым признакам',
    attribute: 'specialType',
    format: 'text',
    plural: false,
  },
  'первичная регистрация': {
    label: 'первичная регистрация',
    attribute: 'registrator',
    format: 'user',
    plural: false,
  },
  'краткое содержание': {
    label: 'краткое содержание',
    attribute: 'resume',
    format: 'text',
    plural: false,
  },
  'собственноручная подпись': {
    label: 'собственноручная подпись',
    attribute: 'handwritten',
    format: 'text',
    plural: false,
  },
  примечание: {
    label: 'примечание',
    attribute: 'notes',
    format: 'text',
    plural: false,
  },
  информация: {
    label: 'информация',
    attribute: 'info',
    format: 'text',
    plural: false,
  },
  'текст информации': {
    label: 'текст информации',
    attribute: 'infoText',
    format: 'text',
    plural: false,
  },
  дата: {
    label: 'дата',
    attribute: 'hiddenDate',
    format: 'text',
    plural: false,
  },
  автор: {
    label: 'автор',
    attribute: 'hiddenAuthor',
    format: 'text',
    plural: false,
  },
  'списано в дело': {
    label: 'списано в дело',
    attribute: 'toArchive',
    format: 'text',
    plural: false,
  },
  'в дело': {
    label: 'в дело',
    attribute: 'hiddenArhcive',
    format: 'text',
    plural: false,
  },
  'готовил списание': {
    label: 'готовил списание',
    attribute: 'preparedArchive',
    format: 'text',
    plural: false,
  },
  'подписал списание': {
    label: 'подписал списание',
    attribute: 'acceptedArchive',
    format: 'text',
    plural: false,
  },
  'направлен ответ': {
    label: 'направлен ответ',
    attribute: 'answerSend',
    format: 'text',
    plural: false,
  },
  срочный: {
    label: 'срочный',
    attribute: 'urgent',
    format: 'text',
    plural: false,
  },
  файл: { label: 'файл', attribute: 'files', format: 'file', plural: true },
};
