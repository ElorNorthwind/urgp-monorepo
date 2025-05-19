import { z } from 'zod';

function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const RdType = {
  PremiseToResidential:
    'Распоряжение Департамента о переводе нежилого помещения в жилое помещение в многоквартирном доме и включении его в жилищный фонд города Москвы',
  PremiseToResidentialGu:
    'Распоряжение Департамента о переводе нежилого помещения в жилое помещение в многоквартирном доме',
  PremiseToNonResidential:
    'Распоряжение Департамента об исключении из жилищного фонда города Москвы жилого помещения и переводе его в нежилой фонд',
  PremiseToNonResidentialGu:
    'Распоряжение Департамента о переводе жилого помещения в нежилое помещение в многоквартирном доме',
  BuildingToResidential:
    'Несуществующее распоряжение Департамента о переводе в жилье но здания (таких не бывает)',
  BuildingToNonResidential:
    'Распоряжение Департамента о переводе жилого дома в нежилой фонд',
} as const;
export type RdType = (typeof RdType)[keyof typeof RdType];
export const rdTypes = getValues(RdType);

export const RdXMLFormSchema = z.object({
  guid: z.string().uuid({ message: 'Некорректный GUID' }),
  rdNum: z.string().regex(/\d+/, { message: 'Некорректный номер РД' }),
  rdDate: z.string().datetime({ message: 'Некорректная дата РД' }),
  fileName: z.string().regex(/\.pdf$/, { message: 'Некорректное имя файла' }),
  cadNum: z.string().regex(/\d{2}:\d{2}:\d{6,7}:\d*/, {
    message: 'Некорректный номер кадастра',
  }),
  rdType: z.enum(rdTypes, { message: 'Некорректный тип РД' }),
});
export type RdXMLFormValues = z.infer<typeof RdXMLFormSchema>;

export type RdXMLFileParseResult = Pick<
  RdXMLFormValues,
  'rdNum' | 'rdDate' | 'fileName' | 'cadNum'
> & { rdType: string };
