export type FiasHint = {
  object_id: number;
  path: string;
  full_name: string;
  full_name_html: string;
};

type FiasAdressDetails = {
  postal_code: string;
  ifns_ul: string;
  ifns_fl: string;
  okato: string;
  oktmo: string;
  cadastral_number: string;
  apart_building: string;
  oktmo_budget: string;
};

type FiasHierarchyItem = {
  number?: string;
  object_type: string;
  region_code: number;
  name: string;
  type_name: string;
  type_short_name: string;
  type_form_code: number;
  object_id: number;
  object_level_id: number;
  object_guid: string;
  full_name: string;
  full_name_short: string;
  kladr_code?: string;
};

type FiasFederalDistrict = {
  id: number;
  full_name: string;
  short_name: string;
  center_id: number;
};

export type FiasAddress = {
  object_id: number;
  object_level_id: number;
  operation_type_id: number;
  object_guid: string;
  address_type: number;
  full_name: string;
  region_code: number;
  is_active: boolean;
  path: string;
  address_details: FiasAdressDetails;
  hierarchy: FiasHierarchyItem[];
  federal_district: FiasFederalDistrict;
};

export type UnfinishedAddress = {
  id: number;
  sessionId: number;
  address: string;
};

export type FiasRequestResult = {
  id: number;
  status: 'success' | 'error';
  value: FiasAddress | null;
  error: any | null;
  source: string;
};

export type AddressResult = {
  id: number;
  sessionId: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  isError: boolean;
  isDone: boolean;
  sessionNpp?: number | null;
  originalAddress?: string | null;
  responseSource?: string | null;
  response?: FiasAddress | null;

  unom?: number | null;
  fullAddress?: string | null;
  postal?: number | null;
  cadNum?: string | null;

  fiasId?: number | null;
  fiasGuid?: string | null;
  fiasPath?: string | null;
  fiasLevel?: number | null;
  fiasIsActive?: boolean | null;

  // levels 6,7,8
  streetName?: string | null;
  streetLevel?: number | null;
  streetType?: string | null;
  streetFiasId?: number | null;
  streetFiasGuid?: string | null;
  streetKladr?: string | null;

  // level 10
  houseNum?: string | null;
  houseType?: string | null;
  houseFiasId?: number | null;
  houseFiasGuid?: string | null;

  // level 11
  apartmentNum?: string | null;
  apartmentType?: string | null;
  apartmentFiasId?: number | null;
  apartmentFiasGuid?: string | null;
};

export type FiasParsedToResult = Omit<
  AddressResult,
  | 'id'
  | 'sessionId'
  | 'createdAt'
  | 'updatedAt'
  | 'originalAddress'
  | 'sessionNpp'
>;
export type AddressReslutUpdate = Omit<
  AddressResult,
  'sessionId' | 'createdAt'
>;
