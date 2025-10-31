type KadNumber = {
  is_deleted: number;
  global_id: number;
  KAD_N: string;
};

type KadZu = {
  is_deleted: number;
  global_id: number;
  KAD_ZU: string;
};

// interface GeoData {
//   coordinates: number[][][];
//   type: string;
// }

type Cells = {
  OBJ_TYPE: string;
  OnTerritoryOfMoscow: 'да' | 'нет';
  ADDRESS: string;
  UNOM: number;
  P1: string | null;
  P3: string | null;
  P4: string | null;
  P5: string | null;
  P6: string | null;
  P7: string | null;
  P90: string | null;
  SIMPLE_ADDRESS: string;
  P91: string | null;
  L1_TYPE: string | null;
  L1_VALUE: string | null;
  L2_TYPE: string | null;
  P0: string | null;
  L2_VALUE: string | null;
  L3_TYPE: string | null;
  P2: string | null;
  L3_VALUE: string | null;
  L4_TYPE: string | null;
  L4_VALUE: string | null;
  L5_TYPE: string | null;
  L5_VALUE: string | null;
  ADM_AREA: string;
  DISTRICT: string;
  NREG: number;
  DREG: string;
  N_FIAS: string;
  D_FIAS: string;
  KAD_N: KadNumber[];
  KAD_ZU: KadZu[];
  KLADR: string;
  TDOC: string;
  NDOC: string;
  DDOC: string;
  ADR_TYPE: string;
  VID: string;
  SOSTAD: string;
  STATUS: string;
  global_id: number;
  geoData: any;
};

export type DataMosAdress = {
  global_id: number;
  Number: number;
  Cells: Cells;
};

export type AdressRegistryRow = {
  global_id: bigint;
  on_territory_of_moscow: boolean;
  unom: number;
  address: string;
  simple_address: string;
  adm_area: string;
  district: string;
  nreg: number;
  dreg: string | null; // Date as string (ISO format)
  n_fias: string;
  d_fias: string | null; // Date as string (ISO format)
  kladr: string;
  tdoc: string;
  ndoc: string;
  ddoc: string | null; // Date as string (ISO format)
  obj_type: string;
  adr_type: string;
  vid: string;
  sostad: string;
  status: string;
  kad_n: string[];
  kad_zu: string[];
  // outline: any;
  p0: string | null;
  p1: string | null;
  p2: string | null;
  p3: string | null;
  p4: string | null;
  p5: string | null;
  p6: string | null;
  p7: string | null;
  p90: string | null;
  p91: string | null;
  l1_type: string | null;
  l1_value: string | null;
  l2_type: string | null;
  l2_value: string | null;
  l3_type: string | null;
  l3_value: string | null;
  l4_type: string | null;
  l4_value: string | null;
  l5_type: string | null;
  l5_value: string | null;
  street_calc: string | null;
};

export type AdressRegistryRowSlim = Pick<
  AdressRegistryRow,
  'global_id' | 'p4' | 'p6' | 'p7' | 'p90' | 'p91' | 'simple_address'
>;

export type AdressRegistryRowCalcStreetData = Pick<
  AdressRegistryRow,
  'global_id' | 'street_calc'
>;

// Проверял только с метром
export type DataMosTransportStation = {
  global_id: string; //bigint?
  Cells: {
    ID: number;
    Name: string;
    OnTerritoryOfMoscow: string;
    AdmArea: string;
    District: string;
    Longitude_WGS84: string;
    Latitude_WGS84: string;
    VestibuleType: string;
    NameOfStation: string;
    Line: string;
    CulturalHeritageSiteStatus: string;
    ModeOnEvenDays: string;
    ModeOnOddDays: string;
    FullFeaturedBPAAmount: number | null;
    LittleFunctionalBPAAmount: number | null;
    BPAAmount: number | null;
    RepairOfEscalators: any[];
    ObjectStatus: string;
    global_id: number;
    geoData: {
      coordinates: number[];
      type: string;
    };
    Station?: string;
    RailwayLine?: string;
    TypeExit?: string;
    Diameter?: Array<{
      StationName?: string;
      DiameterName?: string;
      RouteName?: string;
    }>;
  };
};

export type TransportStationRow = {
  id: string;
  name: string;
  on_territory_of_moscow: boolean;
  adm_area: string;
  district: string;
  vestibule_type: string;
  name_of_station: string;
  line: string;
  cultural_heritage_site_status: string;
  // mode_on_even_days: string;
  // mode_on_odd_days: string;
  // full_featured_bpa_amount: number | null;
  // little_functional_bpa_amount: number | null;
  // bpa_amount: number | null;
  // repair_of_escalators: any[];
  object_status: string;
  geo_data: any;
  station_type: 'metro' | 'rail' | 'mcd';
};
