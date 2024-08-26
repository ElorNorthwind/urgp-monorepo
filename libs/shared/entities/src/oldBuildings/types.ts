import { LatLngExpression, LatLngTuple } from 'leaflet';
import { MultiPolygon } from 'geojson';

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

type NewApartment = {
  unom: number | null;
  unkv: number | null;
  adress: string | null;
  num: string | null;
  areaZhil: number | null;
  areaObsh: number | null;
  areaZhp: number | null;
  roomCount: number | null;
  status: 'Предоставление' | 'Согласие' | 'Отказ' | 'Осмотр';
};

type StageInfo = {
  date: string | null;
  days: number | null;
  id: number | null;
};

type ApartmentCounts = {
  total: number;
  status: {
    order: number;
    problem: number;
    free: number;
    inspection: number;
    reject: number;
    reinspection: number;
    accept: number;
    rd: number;
    contractProject: number;
    contractNotification: number;
    contractPrelimenarySigning: number;
    mfr: number;
    claimStart: number;
    claimSubmit: number;
    claimWon: number;
    claimLost: number;
    lostInspection: number;
    lostAccept: number;
    lostRd: number;
    lostContractProject: number;
    lostContractPrelimenarySigning: number;
    fsspList: number;
    fsspInstitute: number;
    wonRd: number;
    wonContractProject: number;
    contract: number;
  };
  difficulty: {
    problem: number;
    rejected: number;
    litigation: number;
    mfr: number;
  };
  deviation: {
    done: number;
    none: number;
    mfr: number;
    attention: number;
    risk: number;
  };
};

type ProblematicApartment = {
  id: number;
  apartNum: string;
  fio: string;
  apartStatus: string;
  newAdress: NewApartment[] | null;
  stageId: number;
  stage: string;
  action: string;
  problems: string;
  deviation: string;
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
  apartments: ApartmentCounts;
  problematicAparts: ProblematicApartment[];
  totalCount: number;
};

type PlotInfo = {
  id: number;
  adress: string;
  aparts: {
    done: number;
    none: number;
    mfr: number;
    attention: number;
    risk: number;
  };
};

export type ConnectedPlots = {
  newBuildingId: number;
  plots: PlotInfo[];
};

type geoJsonExpression<Tjson> = {
  type: string;
  // coordinates: number[] | number[][] | number[][][];
  coordinates: Tjson;
};

export type OldBuildingRelocationMapElement = {
  id: number;
  adress: string;
  geometry: geoJsonExpression<LatLngExpression[]>;
  path: geoJsonExpression<LatLngExpression[]>;
  start: geoJsonExpression<LatLngTuple>;
  finish: geoJsonExpression<LatLngTuple>;
  type: 'movement' | 'selected' | 'construction' | 'other_on_plot';
  bounds: geoJsonExpression<LatLngExpression[]>;
};

export type OldBuildingsGeoJSON = GeoJSON.FeatureCollection<
  MultiPolygon,
  { id: number; adress: string }
>;
