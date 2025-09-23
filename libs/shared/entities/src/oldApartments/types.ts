import { Message } from '../messages/types';

export type OldAppartment = {
  apartmentId: number;
  buildingId: number;
  okrug: string;
  district: string;
  adress: string;
  apartmentNum: string;
  apartmentType: string;
  roomCount: number | null;
  fio: string;
  status: string;
  kpu: string;
  newApartments: NewApartmentDetails[];
  classificator: OldApartmentClassificator;
  messagesCount: number;
  relocationAge: string;
  relocationTypeId: number;
  buildingDeviation: string;
  buildingRelocationStatus: string;
};
export type OldApartmentTimeline = {
  npp: number;
  source: string;
  group: string;
  date: Date;
  type: string;
  notes: string | null;
};

export type NewApartmentDetails = {
  num: string;
  unkv: string | null;
  unom: number | null;
  adress: string;
  status: string;
  areaObsh: number | null;
  areaZhil: number | null;
  roomCount: number | null;
  defects: boolean | null;
};

export type OldApartmentClassificator = {
  stageName: string;
  action: string;
  stageId: number;
  problems: string[];
  deviation: string;
  stageDate: Date;
  deviationMFR: string;
};

export type OldApartmentDetails = {
  id: number;
  okrug: string;
  district: string;
  fio: string;
  adress: string;
  num: string;
  type: string;
  areaZhil: number | null;
  areaObsh: number | null;
  status: string;
  kpu: string;
  newAparts: NewApartmentDetails[] | null;
  classificator: OldApartmentClassificator;
};

type StageInfo = {
  id: number;
  date: string | null;
  days: number | null;
};
export type ProblematicApartmentInfo = {
  id: number;
  fio: string;
  stage: string;
  action: string;
  stages: {
    resettlementStart: StageInfo;
    order: StageInfo;
    inspection: StageInfo;
    reject: StageInfo;
    reinspection: StageInfo;
    accept: StageInfo;
    rd: StageInfo;
    contractProject: StageInfo;
    contractNotification: StageInfo;
    contractPrelimenarySigning: StageInfo;
    claimStart: StageInfo;
    claimSubmit: StageInfo;
    claimWon: StageInfo;
    claimLost: StageInfo;
    lostInspection: StageInfo;
    lostAccept: StageInfo;
    lostRd: StageInfo;
    lostContractProject: StageInfo;
    lostContractPrelimenarySigning: StageInfo;
    fsspList: StageInfo;
    fsspInstitute: StageInfo;
    wonRd: StageInfo;
    wonContractProject: StageInfo;
    contract: StageInfo;
  };
  stageId: number;
  problems: string;
  deviation: string;
  newAdress: NewApartmentDetails[] | null;
  apartStatus: string;
  apartNum: string;
  messages: Message[] | null;
};

export type ApartmentCapstone = {
  id: number;
  status: string;
  planDate: Date;
  doneDate: Date | null;
};

export type ApartmentDefect = {
  oldApartId: number;
  newApartId: number;
  adress: string;
  apartNum: string;
  conplaintDate: Date | null;
  entryDate: Date | null;
  changedDoneDate: Date | null;
  actualDoneDate: Date | null;
  isDone: boolean | null;
  description: string | null;
  url: string | null;
};

// c.old_apart_id as "oldApartId",
// a.id as "newApartId",
// a.adress,
// a.apart_num as "apartNum",
// a.defect_complaint_date as "conplaintDate",
// a.defect_entry_date as "entryDate",
// a.defect_changed_done_date as "changedDoneDate",
// a.defect_actual_done_date as "actualDoneDate",
// a.defect_is_done as "isDone",
// a.defect_description as "description",
// a.defect_url as "url"
