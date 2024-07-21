type OldBuildingTerms = {
  firstResetlementStart: string | null;
  firstResetlementEnd: string | null;
  secontResetlementEnd: string | null;
  demolitionEnd: string | null;
};

type NewBuildingTerms = {
  commissioning: string | null;
  settlement: string | null;
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
    done: number;
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
  totalApartments: number;
  buildingDeviation: string;
  buildingRelocationStartAge: string;
  buildingRelocationStatus: string;
  termsReason: string | null;
  terms: { plan: OldBuildingTerms; actual: OldBuildingTerms };
  newBuildingConstructions: NewBuilding[] | null;
  newBuildingMovements: NewBuilding[] | null;
  apartments: AppartmentCounts;
  totalCount: number;
};
