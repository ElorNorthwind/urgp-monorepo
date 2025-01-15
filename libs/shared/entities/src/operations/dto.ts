import { z } from 'zod';
import { GET_DEFAULT_CONTROL_DUE_DATE } from '../userInput/config';

// ================ ЭТАПЫ (STAGES) ================

// создание этапа
export const controlStageCreate = z.object({
  caseId: z.coerce.number().nullable().default(null),
  class: z.string().default('stage'),
  typeId: z.coerce.number({ message: 'Тип этапа не выбран' }).default(6),
  doneDate: z.coerce
    .date({ message: 'Дата обязательна' })
    .or(z.number())
    .default(new Date().setHours(0, 0, 0, 0)),
  num: z.string().default(''),
  description: z.string().default(''),
  approverId: z.coerce.number().nullable().default(null),
});
export type ControlStageCreateDto = z.infer<typeof controlStageCreate>;

export const controlStageCreateFormValues = controlStageCreate.pick({
  typeId: true,
  doneDate: true,
  num: true,
  description: true,
  approverId: true,
});
export type ControlStageCreateFormValuesDto = z.infer<
  typeof controlStageCreateFormValues
>;

// изменение этапа
export const controlStageUpdate = controlStageCreate
  .pick({
    class: true,
    doneDate: true,
    num: true,
    description: true,
    approverId: true,
  })
  .partial()
  .extend({
    typeId: z.undefined().optional(),
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
  class: z.literal('dispatch').default('dispatch'),
  typeId: z.coerce.number({ message: 'Тип поручения не выбран' }).default(10),
  dueDate: z.coerce
    .date({ message: 'Дата обязательна' })
    .or(z.number())
    .or(z.string())
    .default(GET_DEFAULT_CONTROL_DUE_DATE()),
  description: z.string().default(''),
  controllerId: z.coerce.number().nullable().default(null),
  executorId: z.coerce.number().nullable().default(null),
});
export type DispatchCreateDto = z.infer<typeof dispatchCreate>;

export const dispatchCreateFormValues = dispatchCreate
  .pick({
    executorId: true,
    dueDate: true,
    description: true,
  })
  .extend({
    controller: z
      .literal('author')
      .or(z.literal('executor'))
      .optional()
      .default('executor'),
    dateDescription: z
      .string()
      .min(1, { message: 'Необходимо указать причину переноса срока' }),
  });
export type DispatchCreateFormValuesDto = z.infer<
  typeof dispatchCreateFormValues
>;

// изменение поручения
export const dispatchUpdate = dispatchCreate
  .pick({
    class: true,
    executorId: true,
    dueDate: true,
    description: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
    // doneDate: z.coerce.date().nullable().default(null),
    dateDescription: z
      .string()
      .min(1, { message: 'Необходимо указать причину переноса срока' }),
    typeId: z.undefined().optional(),
  });
export type DispatchUpdateDto = z.infer<typeof dispatchUpdate>;

// export const dispatchUpdateFormValues = dispatchUpdate
//   .omit({ dateDescription: true })
//   .partial()
//   .extend({
//     dateDescription: z
//       .string()
//       .min(1, { message: 'Необходимо указать причину переноса срока' }),
//   });
// export type DispatchUpdateFormValuesDto = z.infer<
//   typeof dispatchUpdateFormValues
// >;

// ================ НАПОМИНАНИЯ (REMINDERS) ================
// создание напоминаний
export const reminderCreate = z.object({
  caseId: z.coerce.number().nullable().default(null),
  class: z.literal('reminder').default('reminder'),
  typeId: z.coerce.number({ message: 'Тип напоминания не выбран' }).default(11),
  description: z.string().default(''),
  observerId: z.coerce.number().nullable().default(null),
  dueDate: z.coerce
    .date({ message: 'Дата обязательна' })
    .or(z.number())
    .or(z.string())
    .default(GET_DEFAULT_CONTROL_DUE_DATE()),
});
export type ReminderCreateDto = z.infer<typeof reminderCreate>;

export const reminderCreateFormValues = reminderCreate.pick({
  dueDate: true,
  description: true,
});
export type ReminderCreateFormValuesDto = z.infer<
  typeof reminderCreateFormValues
>;

// изменение поручения
export const reminderUpdate = reminderCreate
  .pick({
    class: true,
    dueDate: true,
    description: true,
    typeId: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
    doneDate: z.coerce.date().nullable().default(null),
    // typeId: z.undefined().optional(),
  });
export type ReminderUpdateDto = z.infer<typeof reminderUpdate>;

export const reminderUpdateFormValues = reminderCreateFormValues.partial();
export type ReminderUpdateFormValuesDto = z.infer<
  typeof reminderUpdateFormValues
>;
