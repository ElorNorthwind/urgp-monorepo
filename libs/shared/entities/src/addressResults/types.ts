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
  fiasRequests?: number;
  dadataRequests?: number;
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
  object_level_id?: number;
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

export type DaDataAddress = {
  value: string;
  unrestricted_value: string;
  data: {
    postal_code: string | null;
    country: string | null;
    country_iso_code: string | null;
    federal_district: string | null;
    region_fias_id: string | null;
    fias_id: string | null;
    region_kladr_id: string | null;
    fias_level: string | null;
    house_cadnum: string | null;
  };
};

export type DaDataResult = {
  object_guid: string | null;
  house_cad_num: string | null;
  confidence: string;
  response_source?: string;
  dadataRequests?: number;
  extra?: any;
};

// {
//   "value": "г Москва, пр-кт Вернадского, д 29",
//   "unrestricted_value": "119331, г Москва, Ломоносовский р-н, пр-кт Вернадского, д 29",
//   "data": {
//     "postal_code": "119331",
//     "country": "Россия",
//     "country_iso_code": "RU",
//     "federal_district": "Центральный",
//     "region_fias_id": "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
//     "region_kladr_id": "7700000000000",
//     "region_iso_code": "RU-MOW",
//     "region_with_type": "г Москва",
//     "region_type": "г",
//     "region_type_full": "город",
//     "region": "Москва",
//     "area_fias_id": null,
//     "area_kladr_id": null,
//     "area_with_type": null,
//     "area_type": null,
//     "area_type_full": null,
//     "area": null,
//     "city_fias_id": "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
//     "city_kladr_id": "7700000000000",
//     "city_with_type": "г Москва",
//     "city_type": "г",
//     "city_type_full": "город",
//     "city": "Москва",
//     "city_area": "Юго-западный",
//     "city_district_fias_id": null,
//     "city_district_kladr_id": null,
//     "city_district_with_type": null,
//     "city_district_type": null,
//     "city_district_type_full": null,
//     "city_district": null,
//     "settlement_fias_id": null,
//     "settlement_kladr_id": null,
//     "settlement_with_type": null,
//     "settlement_type": null,
//     "settlement_type_full": null,
//     "settlement": null,
//     "street_fias_id": "1e3e2818-9fe2-4981-89c7-612cec372a8c",
//     "street_kladr_id": "77000000000095300",
//     "street_with_type": "пр-кт Вернадского",
//     "street_type": "пр-кт",
//     "street_type_full": "проспект",
//     "street": "Вернадского",
//     "stead_fias_id": null,
//     "stead_cadnum": null,
//     "stead_type": null,
//     "stead_type_full": null,
//     "stead": null,
//     "house_fias_id": "ace2e4e1-6b5e-4e79-8a2b-85faaf92001c",
//     "house_kladr_id": "7700000000009530049",
//     "house_cadnum": "77:06:0001007:1040",
//     "house_flat_count": "0",
//     "house_type": "д",
//     "house_type_full": "дом",
//     "house": "29",
//     "block_type": null,
//     "block_type_full": null,
//     "block": null,
//     "entrance": null,
//     "floor": null,
//     "flat_fias_id": null,
//     "flat_cadnum": null,
//     "flat_type": null,
//     "flat_type_full": null,
//     "flat": null,
//     "flat_area": null,
//     "square_meter_price": null,
//     "flat_price": null,
//     "room_fias_id": null,
//     "room_cadnum": null,
//     "room_type": null,
//     "room_type_full": null,
//     "room": null,
//     "postal_box": null,
//     "fias_id": "ace2e4e1-6b5e-4e79-8a2b-85faaf92001c",
//     "fias_code": null,
//     "fias_level": "8",
//     "fias_actuality_state": "0",
//     "kladr_id": "7700000000009530049",
//     "geoname_id": "524901",
//     "capital_marker": "0",
//     "okato": "45293574000",
//     "oktmo": "45904000",
//     "tax_office": "7736",
//     "tax_office_legal": "7736",
//     "timezone": "UTC+3",
//     "geo_lat": "55.681712",
//     "geo_lon": "37.516449",
//     "beltway_hit": "IN_MKAD",
//     "beltway_distance": null,
//     "metro": null,
//     "divisions": null,
//     "qc_geo": "0",
//     "qc_complete": null,
//     "qc_house": null,
//     "history_values": null,
//     "unparsed_parts": null,
//     "source": null,
//     "qc": null
//   }
