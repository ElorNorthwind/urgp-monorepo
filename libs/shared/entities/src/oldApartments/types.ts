type AppartmentDates = {
  resettlementStart: Date | null;
  order: Date | null;
  mfr: Date | null;
  inspection: Date | null;
  accept: Date | null;
  reject: Date | null;
  reinspection: Date | null;
  litigationClaim: Date | null;
  litigationDecision: Date | null;
  rd: Date | null;
  contractProject: Date | null;
  contractPrelimenatySigning: Date | null;
  contract: Date | null;
};

type AppartmentOrderInfo = {
  status: string;
  reason: string | null;
  actual: boolean;
  adress: string | null;
  apartNumber: string;
  area: number | null;
  roomCount: number | null;
  inspectionDate: Date | null;
  inspectionResponseDate: Date | null;
  inspectionResponse: string | null;
  rdDate: Date | null;
  rdNum: string | null;
  contractStatus: string | null;
  contractDate: Date | null;
  contractNum: string | null;
};

type AppartmentLitigationInfo = {
  claimDate: Date | null;
  caseNum: string | null;
  caseCategody: string | null;
  caseResult: string | null;
  hearingResult: string | null;
  subjectOfProceedings: string | null;
  finalResult: string | null;
  notes: string | null;
  hearingDate: Date | null;
  lastActDate: Date | null;
  appealDate: Date | null;
  decisionDate: Date | null;
};

export type OldAppartment = {
  id: number;
  kpuNum: string;
  oldApartBuildingId: number;
  okrug: string;
  district: string;
  oldApartAdress: string;
  oldApartNum: string;
  oldApartType: string | null;
  oldApartArea: number | null;
  oldApartRoomCount: number | null;
  fio: string | null;
  peopleCount: number;
  requirement: string | null;
  oldApartStatus: string | null;
  litigationResult: string | null;
  notes: string | null;
  statusId: number;
  difficultyId: number;
  statusGroup: string;
  status: string;
  deviation: string;
  nextStepTerm: Date | null;
  dates: AppartmentDates;
  orders: AppartmentOrderInfo | null;
  litigationCases: AppartmentLitigationInfo | null;
};
