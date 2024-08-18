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
  totalCount: number;
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
};

export type OldApartmentClassificator = {
  stage: string;
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
