import { LatLngExpression, LatLngTuple } from 'leaflet';
import { MultiPolygon } from 'geojson';
import { z } from 'zod';

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

type NewBuildingConnectionTerms = {
  start: string | null;
  demolition: string | null;
};

type NewBuildingConnection = {
  id: number;
  type: 'movement' | 'construction';
  terms: {
    plan: NewBuildingConnectionTerms;
    actual: NewBuildingConnectionTerms;
  };
  adress: string;
};

export type NewBuilding = {
  id: number;
  adress: string;
  okrug: string;
  district: string;
  terms: { plan: NewBuildingTerms; actual: NewBuildingTerms };
  type: string;
  priority: number;
  connections: NewBuildingConnection[];
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
  statusOrder: number;
  okrugOrder: number;
  apartments: ApartmentCounts;
  total: number;
  // totalCount: number;
  // newBuildingConstructions: NewBuilding[] | null;
  // newBuildingMovements: NewBuilding[] | null;
  // problematicAparts: ProblematicApartment[];
};

export type OldBuildingConnectionsInfo = {
  id: number;
  newBuildingConstructions: NewBuilding[] | null;
  newBuildingMovements: NewBuilding[] | null;
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

export type BuildingRelocationMapElement = {
  id: number;
  adress: string;
  geometry: geoJsonExpression<LatLngExpression[]>;
  path: geoJsonExpression<LatLngExpression[]>;
  start: geoJsonExpression<LatLngTuple>;
  finish: geoJsonExpression<LatLngTuple>;
  type: 'movement' | 'selected' | 'construction' | 'other_on_plot';
  bounds: geoJsonExpression<LatLngExpression[]>;
};

export type BuildingsGeoJSON = GeoJSON.FeatureCollection<
  MultiPolygon,
  { id: number; adress: string }
>;

export const manualDateSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  buildingId: z.coerce.number().int().nonnegative(),
  type: z.string(),
  priority: z.coerce.number().int().nonnegative(),
  controlDate: z.string().datetime({ message: 'Нужна дата' }),
  createdAt: z.string().datetime(),
  documents: z.string().nullable(),
  notes: z.string().nullable(),
});
export type ManualDate = z.infer<typeof manualDateSchema>;

export const createManualDateSchema = manualDateSchema
  .pick({
    buildingId: true,
    controlDate: true,
    documents: true,
    notes: true,
  })
  .extend({
    typeId: z.coerce.number().int().nonnegative({ message: 'Нужен тип даты' }),
  });
export type CreateManualDateDto = z.infer<typeof createManualDateSchema>;
