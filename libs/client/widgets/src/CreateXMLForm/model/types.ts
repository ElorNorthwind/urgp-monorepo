import { z } from 'zod';

function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const RdType = {
  PremiseToResidential: 'О переводе в жилье',
  PremiseToNonResidential: 'О переводе в нежилье',
  BuildingToResidential: 'О переводе в жилье но здания',
  BuildingToNonResidential: 'О переводе в нежилье но здания',
} as const;
export type RdType = (typeof RdType)[keyof typeof RdType];
export const rdTypes = getValues(RdType);

export const RdXMLFormSchema = z.object({
  guid: z.string().uuid({ message: 'Некорректный GUID' }),
  rdNum: z.string().min(1, { message: 'Некорректный номер РД' }),
  rdDate: z.string().datetime({ message: 'Некорректная дата РД' }),
  fileName: z.string().min(1, { message: 'Некорректное имя файла' }),
  cadNum: z.string().min(1, { message: 'Некорректный номер кадастра' }),
  // rdType: z.enum(rdTypes, { message: 'Некорректный тип РД' }),
  rdType: z.string(),
});
export type RdXMLFormValues = z.infer<typeof RdXMLFormSchema>;
