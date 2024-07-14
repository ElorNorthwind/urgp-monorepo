type OldBuildingTerms = {
  firstResetlementStart: Date | null;
  firstResetlementEnd: Date | null;
  secontResetlementEnd: Date | null;
  demolitionEnd: Date | null;
};

type NewBuildingTerms = {
  commissioning: Date | null;
  settlement: Date | null;
};

type NewBuilding = {
  id: number;
  adress: string;
  okrug: string;
  district: string;
  terms: { plan: NewBuildingTerms; actual: NewBuildingTerms };
  type: string;
  priority: number;
};

type AppartmentCounts = {
  total: number;
  status: {
    empty: number;
    notStarted: number;
    mfr: number;
    inspection: number;
    rejected: number;
    reinspection: number;
    accepted: number;
    rd: number;
    litigations: number;
    litigationsDone: number;
    contractProject: number;
    contractPrelimenatySigning: number;
    contract: number;
  };
  difficulty: {
    normal: number;
    problem: number;
    rejected: number;
    litigation: number;
    mfr: number;
  };
  deviation: {
    none: number;
    attention: number;
    risk: number;
  };
};

export type OldBuilding = {
  id: number;
  okrug: string;
  district: string;
  adress: string;
  relocationTypeId: number;
  relocationType: string;
  totalAppartments: number;
  termsReason: string | null;
  terms: { plan: OldBuildingTerms; actual: OldBuildingTerms };
  appartments: AppartmentCounts;
  newBuildingConstructions: NewBuilding[] | null;
  newBuildingMovements: NewBuilding[] | null;
};
