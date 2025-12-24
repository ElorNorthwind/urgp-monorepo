import { EdoResolution } from './edo-resolution';

export type EdoUserInfo = {
  userId: string;
  userFio?: string;
  group?: string; // надо только для междведомственного взаимодействия...
};

export type EdoLinkType = 'child' | 'parent' | 'link' | 'project';

export type EdoDocLink = {
  documentId: string;
  type?: EdoLinkType;
  linkedOrg?: string;
  num?: string;
  date?: Date;
  document?: EdoDocument; // мы же любим рекурсивные запросы, да?
};

export type EdoAgreetableRecord = {
  user?: Partial<EdoUserInfo>; // Паршал потому что в уже зарегистрированных документах нет id согласовывавших, только ФИО
  status?: string;
  date?: Date;
  comments?: string;
};

export type EdoAppendedFile = {
  id: number;
  name?: string;
  filesize?: number;
};

export type EdoOgQuestion = {
  id: number;
  n: number;
  annotation?: string;
  category?: number;
  theme_id?: number;
  kind_ref_id?: number;
  type_replication?: number;
  theme_path?: string;
  theme_name?: string;
  kind_name?: string;
  type_replication_name?: string;
};

export type EdoOgAuthor = {
  id: number;
  n?: number;
  fio?: string; // ln
  country_name?: string;
  republic_name?: string;
  republic_area_name?: string;
  city_name?: string;
  adistrict_name?: string;
  district_name?: string;
  street?: string;
  house?: string;
  building?: string;
  apartment?: string;
  zip?: string;
  phone?: string;
  email?: string;
};

export type EdoDocumentIdField = {
  documentId?: string;
};

export type EdoDocumentCardFields = {
  // СИНИЙ БЛОК - входящтий документ
  docInNum?: string;
  docInDate?: Date;
  adressedTo?: EdoUserInfo[];
  // ЗЕЛЕНЫЙ БЛОК - исходящий документ
  docOutNum?: string;
  docOutDate?: Date;
  signedBy?: EdoUserInfo;
  createdBy?: EdoUserInfo;
  // ЖЕЛТЫЙ БЛОК 1 - Регистрационные данные
  docStatus?: string;
  pagesCount?: string; // сделать вмесо текста свой объект?
  docType?: string;
  deliveryType?: string;
  specialDocType?: string;
  // Поля, пересекающиеся с обращением граждан
  curator?: EdoUserInfo;
  summury?: string;
  firstRegistrator?: EdoUserInfo;
  // Поля исполнения и отпавки
  result?: string;
  handSignature?: string;
  isUrgent?: string;
  memo?: string;
  info?: string;
  wrightOf?: string;
  replySend?: string;
  // ССЫЛКИ (из всех блоков. Внешние не реализовывал)
  linkedDocs?: EdoDocLink[];
};

export type EdoDocumentAgreetableFields = {
  agreetable?: EdoAgreetableRecord[];
  currentSignatory?: EdoUserInfo;
};

export type EdoDocumentFilesField = {
  files?: EdoAppendedFile[];
};

export type EdoDocumentFullTextField = {
  fullText?: string;
};

export type EdoDocumentOgFields = {
  questions?: EdoOgQuestion[];
  authors?: EdoOgAuthor[];
};

export type EdoDocumentResolutionFields = {
  resolutions?: EdoResolution[];
};

export type EdoDocumentError = {
  error?: any; // Надо бы типизировать
};

export type EdoDocument = EdoDocumentIdField &
  EdoDocumentCardFields &
  EdoDocumentAgreetableFields &
  EdoDocumentFilesField &
  EdoDocumentOgFields &
  EdoDocumentError &
  EdoDocumentFullTextField;
