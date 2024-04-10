export type DbUser = {
  id: number; // UserID
  edoId?: number | null; // EDO_ID
  edoPassword?: string | null; // EDO_Password
  fio?: string | null; // UserFIO
  uprId?: number | null; // upr_id
  otdelId?: number | null; // OtdelID
};

export type DbOperation = {
  id: number; // ReplyID
  createdAt: Date; // EntryDate
  num?: string; // ReplyNum
  notes?: string; // ReplyNotes
  caseId?: number; // CaseID
  signatoryId?: number; // SignatoryID
  currentId?: number; // CurrentSigID
  edoId?: number; // EDO_Case_ID
  date?: Date; // CreationDate
};

export type DbStreet = {
  value: string; // value
  label: string; // label
  similarity?: string; // similarity
};

export type DbCase = {
  id: number; // CaseID
  edoId: number; // EDO_Case_ID
  isArchived?: boolean; // Archived
  createdAt?: Date; // EntryDate
  caseNum?: string; // CaseNum
  caseDate?: Date; // CaseDate
  zamResolutionId?: string; // RezToBiktimirov
  zamDueDate: Date | null; // ZamDueDate
  zamDoneDate: Date | null; // ZamDoneDate
  uprResolutionId?: string; // RezToLukyanov
  uprBossId?: number; // UprBossID
  uprDueDate?: Date; // UprDueDate
  expertResolutionId?: string; // RezToExpert
  expertId?: number; // ExpertID
  expertDueDate?: Date; // ExpertDueDate
  userResolutionId?: string; // RezToUser
  userId?: number; // UserID
  userDueDate?: Date; // UserDueDate
  curator?: string; // Curator
  resolutionText?: string; // Resolution
  resumeText?: string; // ResumeText
  notesText?: string; // CaseNotes
  hasIdenticalCases?: boolean; // SameCases
  adress?: string; // Adress
  fio?: string; // FIO
  isRedControll?: boolean; // RedControll
  statusId?: number; // CaseStatusTypeID
  firstReplyDate?: Date; // case_first_reply_date
  themeId?: number; // new_theme_id
  questionId?: number; // new_question_id
  problebId?: number; // new_problem_id
  isClient?: boolean; // new_is_client
  isReaction?: boolean; // new_is_reaction
  isComplaint?: boolean; // new_is_complaint
  priority: number; // priority
  operations?: DbOperation[];
};

export type DbQuestion = {
  id: number; // question_id
  questionName: string; // question_name
  themeId: number; // theme_id
  questionText?: string; //question_text
  descriptionText?: string; // description_text
  yandexEmbedding?: number[]; // yandex_embedding
};

export type CaseReply = {
  records: DbCase[];
  count: number;
  hasMore: boolean;
  lastPrio?: number;
  lastDate?: Date;
  lastId?: number;
};

// Выборка данных по столбцам БД:
//
// SELECT *
//   FROM information_schema.columns
//  WHERE table_schema = 'public'
//    AND table_name   = 'cases'
//      ;

export type ExternalSystem = 'EDO' | 'RSM';

export type DbExternalCredentials = {
  userId?: number;
  orgId?: number;
  lonig: string;
  password: string;
  system: ExternalSystem;
  name?: string;
};
