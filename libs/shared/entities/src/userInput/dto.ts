import { z } from 'zod';
import { entityClassesValues, operationClassesValues } from './config';
// const entityClassesValues: ["control-incident" | "control-problem" | "stage" | "reminder" | "dispatch"]

export const approveControlEntitySchema = z.object({
  id: z.coerce.number(),
  approveStatus: z
    .enum(['project', 'approved', 'pending', 'rejected'])
    .default('project'),
  approveNotes: z.string().nullable().optional(),
  approveToId: z.coerce.number().nullable(),
  dueDate: z.string().datetime().optional(),
});
export type ApproveControlEntityDto = z.infer<
  typeof approveControlEntitySchema
>;

export const approveControlEntityFormSchema = z.object({
  nextApproverId: z.coerce.number().nullable(),
  approveNotes: z.string().optional(),
  dueDate: z.coerce
    .date()
    .or(z.number())
    .or(z.string().date())
    .nullable()
    .optional(),
});
export type ApproveControlEntityFormDto = z.infer<
  typeof approveControlEntityFormSchema
>;

// удаление сущности по id
export const deleteControlEntirySchema = z.object({
  id: z.coerce.number(),
});
export type DeleteControlEntityDto = z.infer<typeof deleteControlEntirySchema>;

// Универсальный селектор на сущности

// Helper function to preprocess arrays or comma-separated strings
const preprocessArrayOrString = (obj: unknown) => {
  if (Array.isArray(obj)) return obj;
  if (typeof obj === 'string') return obj.split(',');
  if (typeof obj === 'number') return [obj];
  return null;
};

export const numberOrArraySchema = z.preprocess(
  preprocessArrayOrString,
  z.array(z.coerce.number()).nullable().default(null).optional(),
);

export const operationClassOrArraySchema = z.preprocess(
  preprocessArrayOrString,
  z.array(z.enum(operationClassesValues)).default(['reminder']).optional(),
);

const controlClassOrArraySchema = z.preprocess(
  preprocessArrayOrString,
  z.array(z.enum(entityClassesValues)).nullable().default(null).optional(),
);

export const readEntitySchema = z.object({
  mode: z.enum(['full', 'slim']).nullable().default('full').optional(),
  class: controlClassOrArraySchema,
  case: numberOrArraySchema,
  operation: numberOrArraySchema,
  visibility: z
    .enum(['all', 'visible', 'pending'])
    .nullable()
    .default('visible') // ignored in slim mode
    .optional(),
});
export type ReadEntityDto = z.infer<typeof readEntitySchema>;
