import { NotFoundException } from '@nestjs/common';
import {
  AddressResult,
  clearMunicipalAddressPart,
  FiasAddress,
  FiasAddressWithDetails,
  FiasParsedToResult,
} from '@urgp/shared/entities';

export const formatFiasDataForDb = (
  value: FiasAddressWithDetails,
): FiasParsedToResult => {
  if (value?.object_id < 0) throw new NotFoundException('Адрес не найден');

  const street = value.hierarchy.find((item) =>
    [5, 6, 7, 8].includes(item.object_level_id),
  );
  const house = value.hierarchy.find((item) => item.object_level_id === 10);
  const apartment = value.hierarchy.find((item) => item.object_level_id === 11);

  return {
    isError: false,
    isDone: true,
    responseSource: value?.response_source || 'fias-search',
    response: value,
    confidence: value.confidence,

    // unom: null,
    fullAddress: value.full_name, // clearMunicipalAddressPart(value.full_name), //oh-oh
    postal: parseInt(value.address_details.postal_code) || null,
    cadNum: value.address_details.cadastral_number,
    houseCadNum: value.house_cad_num,

    fiasId: value?.object_id || null,
    fiasGuid: value?.object_guid || null,
    fiasPath: value?.path || null,
    fiasLevel: value?.object_level_id || null,
    fiasIsActive: value?.is_active || null,

    // levels 6,7,8
    streetName: street?.name || null,
    streetLevel: street?.object_level_id || null,
    streetType: street?.type_name || null,
    streetFiasId: street?.object_id || null,
    streetFiasGuid: street?.object_guid || null,
    streetKladr: street?.kladr_code || null,

    // level 10
    houseName: house?.name || null,
    houseNum: house?.number || null,
    houseType: house?.type_name || null,
    houseAddNum1: house?.add_number1 || null,
    houseAddType1: house?.add_type1_name || null,
    houseAddNum2: house?.add_number2 || null,
    houseAddType2: house?.add_type2_name || null,
    houseFiasId: house?.object_id || null,
    houseFiasGuid: house?.object_guid || null,

    // level 11
    apartmentNum: apartment?.number || null,
    apartmentType: apartment?.type_name || null,
    apartmentFiasId: apartment?.object_id || null,
    apartmentFiasGuid: apartment?.object_guid || null,
  };
};

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
