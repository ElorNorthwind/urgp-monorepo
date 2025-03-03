import { FiasAddress, FiasHint } from '@urgp/shared/entities';

export const FIAS_HTTP_OPTIONS = {
  baseURL: 'https://fias-public-service.nalog.ru/api/spas/v2.0',
  headers: {
    'Content-Type': 'Application/json',
  },
};

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
