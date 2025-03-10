import { FiasAddressWithDetails, FiasHint, FiasParsedToResult } from './types';

export const FIAS_CONCURRENCY = 10;
export const FIAS_DB_STEP = 50;
export const FIAS_TIMEOUT = 100;
export const FIAS_RETRY_COUNT = 1;

export const hintNotFound: FiasHint = {
  object_id: -1,
  path: '',
  full_name: 'Адрес не найден',
  full_name_html: '',
};

export const addressNotFound: FiasAddressWithDetails = {
  object_id: -1,
  object_level_id: -1,
  operation_type_id: -1,
  object_guid: '',
  address_type: -1,
  full_name: 'Адрес не найден',
  region_code: -1,
  is_active: false,
  path: '',
  address_details: {
    postal_code: '',
    ifns_ul: '',
    ifns_fl: '',
    okato: '',
    oktmo: '',
    cadastral_number: '',
    apart_building: '',
    oktmo_budget: '',
  },
  hierarchy: [],
  federal_district: {
    id: -1,
    full_name: '',
    short_name: '',
    center_id: -1,
  },
  house_cad_num: '',
  confidence: 'none',
};

export const addressNotFoundParsedToResult: FiasParsedToResult = {
  isError: true,
  isDone: true,
  responseSource: 'fias-search',
  response: addressNotFound,
  confidence: 'none',

  fullAddress: 'Адрес не найден',

  //   unom: null,
  postal: -1,
  cadNum: '',
  houseCadNum: '',

  fiasId: -1,
  fiasGuid: '',
  fiasPath: '',
  fiasLevel: -1,
  fiasIsActive: false,

  // levels 6,7,8
  streetName: '',
  streetLevel: -1,
  streetType: '',
  streetFiasId: -1,
  streetFiasGuid: '',
  streetKladr: '',

  // level 10
  houseName: '',
  houseNum: '',
  houseType: '',
  houseAddNum1: '',
  houseAddType1: '',
  houseAddNum2: '',
  houseAddType2: '',
  houseFiasId: -1,
  houseFiasGuid: '',

  // level 11
  apartmentNum: '',
  apartmentType: '',
  apartmentFiasId: -1,
  apartmentFiasGuid: '',
};
