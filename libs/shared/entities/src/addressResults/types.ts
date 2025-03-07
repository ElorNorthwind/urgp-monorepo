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
  add_number1?: string;
  add_number2?: string;
  add_type1_name?: string;
  add_type2_name?: string;
  add_type1_short_name?: string;
  add_type2_short_name?: string;
};

//         "number": "7",
//         "full_name": "дом 7",
//         "object_id": 69766498,
//         "type_name": "Дом",
//         "add_number1": "",
//         "add_number2": "",
//         "object_guid": "ac7462f6-d6b6-4f54-82c7-0f4e7bf45a22",
//         "object_type": "house",
//         "add_type1_name": "",
//         "add_type2_name": "",
//         "full_name_short": "д. 7",
//         "object_level_id": 10,
//         "type_short_name": "д.",
//         "add_type1_short_name": "",
//         "add_type2_short_name": ""

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

export type FiasAddressWithDetails = FiasAddress & {
  house_cad_num: string | null;
  confidence: string;
  response_source?: string;
  requests?: number;
  extra?: any;
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
  confidence?: string | null;

  unom?: number | null;
  fullAddress?: string | null;
  postal?: number | null;
  cadNum?: string | null;
  houseCadNum: string | null;

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
  houseName?: string | null;
  houseNum?: string | null;
  houseType?: string | null;
  houseAddNum1?: string | null;
  houseAddType1?: string | null;
  houseAddNum2?: string | null;
  houseAddType2?: string | null;
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

type AddressPartInfo = {
  name?: string;
  type_name?: string;
  number?: string;
};

export type FiasAddressPart = {
  region?: AddressPartInfo;
  street?: AddressPartInfo;
  house?: AddressPartInfo;
  flat?: AddressPartInfo;
  object_level_id?: 10 | 11;
};

// {
//   "region": {
//     "name": "Москва",
//     "type_name": "город"
// },
//   "street": {
//     "name": "Зеленоград"
//   },
//   "house": {
//     "number": "корп 515"
//   },
//   "flat": {
//     "number": "квартира 1"
//   },
//   "object_level_id": 11
// }

// {
//     "path": "1405113.1409606.69766498",
//     "full_name": "город Москва, аллея Берёзовая, дом 7",
//     "hierarchy": [
//       {
//         "name": "Москва",
//         "full_name": "город Москва",
//         "object_id": 1405113,
//         "type_name": "Город",
//         "kladr_code": "7700000000000",
//         "object_guid": "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
//         "object_type": "region",
//         "region_code": 77,
//         "type_form_code": 0,
//         "full_name_short": "г Москва",
//         "object_level_id": 1,
//         "type_short_name": "г"
//       },
//       {
//         "name": "Берёзовая",
//         "full_name": "аллея Берёзовая",
//         "object_id": 1409606,
//         "type_name": "Аллея",
//         "kladr_code": "77000000000084400",
//         "object_guid": "2e766ee0-f2f2-4015-bfaf-d253bc67ee1c",
//         "object_type": "address_object",
//         "type_form_code": 0,
//         "full_name_short": "аллея Берёзовая",
//         "object_level_id": 8,
//         "type_short_name": "аллея"
//       },
//       {
//         "number": "7",
//         "full_name": "дом 7",
//         "object_id": 69766498,
//         "type_name": "Дом",
//         "add_number1": "",
//         "add_number2": "",
//         "object_guid": "ac7462f6-d6b6-4f54-82c7-0f4e7bf45a22",
//         "object_type": "house",
//         "add_type1_name": "",
//         "add_type2_name": "",
//         "full_name_short": "д. 7",
//         "object_level_id": 10,
//         "type_short_name": "д.",
//         "add_type1_short_name": "",
//         "add_type2_short_name": ""
//       }
//     ],
//     "is_active": true,
//     "object_id": 69766498,
//     "object_guid": "ac7462f6-d6b6-4f54-82c7-0f4e7bf45a22",
//     "region_code": 77,
//     "address_type": 1,
//     "address_details": {
//       "okato": "45280574000",
//       "oktmo": "45359000",
//       "ifns_fl": "7715",
//       "ifns_ul": "7715",
//       "postal_code": "127273",
//       "oktmo_budget": "45359000",
//       "apart_building": "1",
//       "cadastral_number": "77:02:0008009:1003"
//     },
//     "object_level_id": 10,
//     "federal_district": {
//       "id": 1,
//       "center_id": 1405113,
//       "full_name": "Центральный федеральный округ",
//       "short_name": "ЦФО"
//     },
//     "operation_type_id": 20
//   }
