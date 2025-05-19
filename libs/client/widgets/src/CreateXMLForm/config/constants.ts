import { RdType } from '@urgp/shared/entities';
import { v4 as uuidv4 } from 'uuid';

export const emptyFormValues = {
  guid: uuidv4(),
  rdNum: '',
  rdDate: new Date().toISOString(),
  fileName: '',
  rdType: RdType.PremiseToResidential,
  cadNum: '',
};

export const RdTypeOptions = [
  { value: RdType.PremiseToResidential, label: 'Перевод помещения в жилье' },
  {
    value: RdType.PremiseToResidentialGu,
    label: 'Перевод помещения в жилье (ГУ)',
  },
  {
    value: RdType.PremiseToNonResidential,
    label: 'Перевод помещения в нежилье',
  },
  {
    value: RdType.PremiseToNonResidentialGu,
    label: 'Перевод помещения в нежилье (ГУ)',
  },
  { value: RdType.BuildingToNonResidential, label: 'Перевод здания в нежилое' },
];
