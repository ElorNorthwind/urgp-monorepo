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
  kladr_code: string;
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
