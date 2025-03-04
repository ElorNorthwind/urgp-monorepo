import { FiasAddress, FiasHint, FiasParsedToResult } from './types';

export const FIAS_CONCURRENCY = 300;
export const FIAS_DB_STEP = 300;
export const FIAS_TIMEOUT = 50;
export const FIAS_RETRY_COUNT = 1;

export const hintNotFound: FiasHint = {
  object_id: -1,
  path: '',
  full_name: 'Адрес не найден',
  full_name_html: '',
};

export const addressNotFound: FiasAddress = {
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
};

export const addressNotFoundParsedToResult: FiasParsedToResult = {
  isError: true,
  isDone: true,
  responseSource: 'fias-search',
  response: addressNotFound,
  fullAddress: 'Адрес не найден',

  //   unom: null,
  postal: null,
  cadNum: null,

  fiasId: null,
  fiasGuid: null,
  fiasPath: null,
  fiasLevel: null,
  fiasIsActive: null,

  // levels 6,7,8
  streetName: null,
  streetLevel: null,
  streetType: null,
  streetFiasId: null,
  streetFiasGuid: null,
  streetKladr: null,

  // level 10
  houseNum: null,
  houseType: null,
  houseFiasId: null,
  houseFiasGuid: null,

  // level 11
  apartmentNum: null,
  apartmentType: null,
  apartmentFiasId: null,
  apartmentFiasGuid: null,
};
