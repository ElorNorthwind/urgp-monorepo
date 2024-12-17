import { z } from 'zod';

// ================ ЭТАПЫ (STAGES) ================

// создание этапа
export const controlStageCreate = z.object({
  caseId: z.coerce.number().nullable().default(null),
  // authorId: z.coerce.number().nullable().default(null),
  type: z.coerce.number(),
  doneDate: z.coerce.date(),
  num: z.string().default(''),
  // externalCase: externalCase.nullable().default(null), // внешний номер,
  description: z.string().default(''),
  approver: z.coerce.number().nullable().default(null),
});
export type ControlStageCreateDto = z.infer<typeof controlStageCreate>;

export const controlStageCreateFormValues = controlStageCreate.pick({
  type: true,
  // externalCase: true,
  doneDate: true,
  num: true,
  description: true,
  approver: true,
});
export type ControlStageCreateFormValuesDto = z.infer<
  typeof controlStageCreateFormValues
>;

// изменение этапа
export const controlStageUpdate = controlStageCreate
  .pick({
    type: true,
    // externalCase: true,
    doneDate: true,
    num: true,
    description: true,
    approver: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
  });
export type ControlStageUpdateDto = z.infer<typeof controlStageUpdate>;

export const controlStageUpdateFormValues =
  controlStageCreateFormValues.partial();
export type ControlStageUpdateFormValuesDto = z.infer<
  typeof controlStageUpdateFormValues
>;

// ================ ПОРУЧЕНИЯ (DISPATCHES) ================

// создание поручения
export const dispatchCreate = z.object({
  caseId: z.coerce.number().nullable().default(null),
  problemId: z.coerce.number().nullable().default(null),
  authorId: z.coerce.number(),
  executorId: z.coerce.number(),
  type: z.coerce.number(),
  dueDate: z.coerce.date().nullable().default(null),
  description: z.string().nullable().default(null),
});
export type DispatchCreateDto = z.infer<typeof dispatchCreate>;

export const dispatchCreateFormValues = dispatchCreate.pick({
  executorId: true,
  type: true,
  dueDate: true,
  description: true,
});
export type DispatchCreateFormValuesDto = z.infer<
  typeof dispatchCreateFormValues
>;

// изменение поручения
export const dispatchUpdate = dispatchCreate
  .pick({
    executorId: true,
    type: true,
    dueDate: true,
    description: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
  });
export type DispatchUpdateDto = z.infer<typeof dispatchUpdate>;

export const dispatchUpdateFormValues = dispatchCreateFormValues.partial();
export type DispatchUpdateFormValuesDto = z.infer<
  typeof dispatchUpdateFormValues
>;
