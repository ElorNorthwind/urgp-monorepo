import { z } from 'zod';
import { GET_DEFAULT_CONTROL_DUE_DATE } from '../userInput/config';
import { startOfToday } from 'date-fns';

export const readOperationSchema = z.object({
  // mode: z.enum(['full', 'slim']).default('full'),
  class: z.enum(['all', 'dispatch', 'reminder', 'stage']).default('stage'),
  operation: z.coerce
    .number()
    .or(
      z.preprocess((obj) => {
        if (Array.isArray(obj)) {
          return obj;
        } else if (typeof obj === 'string') {
          return obj.split(',');
        } else {
          return null;
          // return [];
        }
      }, z.array(z.coerce.number())),
    )
    .nullable()
    .default(null)
    .optional(),
  case: z.coerce
    .number()
    .or(
      z.preprocess((obj) => {
        if (Array.isArray(obj)) {
          return obj;
        } else if (typeof obj === 'string') {
          return obj.split(',');
        } else {
          return null;
          // return [];
        }
      }, z.array(z.coerce.number())),
    )
    .nullable()
    .default(null)
    .optional(),
});
export type ReadOperationDto = z.infer<typeof readOperationSchema>;

// ================ ЭТАПЫ (STAGES) ================

// создание этапа
export const controlStageCreate = z.object({
  caseId: z.coerce.number().nullable().default(null),
  class: z.string().default('stage'),
  typeId: z.coerce.number({ message: 'Тип этапа не выбран' }).default(6),
  doneDate: z.coerce
    .date({ message: 'Дата обязательна' })
    .or(z.number())
    .or(z.string().date())
    .default(startOfToday().toISOString()),
  num: z.string().default(''),
  description: z.string().default(''),
  approverId: z.coerce.number().nullable().optional().default(null),
});
export type ControlStageCreateDto = z.infer<typeof controlStageCreate>;

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
    id: z.coerce.number(),
  });
export type ControlStageUpdateDto = z.infer<typeof controlStageUpdate>;

export const controlStageFormValuesDto = controlStageCreate
  .pick({
    caseId: true,
    class: true,
    typeId: true,
    doneDate: true,
    num: true,
    description: true,
    approverId: true,
  })
  .extend({
    id: z.coerce.number().nullable().default(null),
  });
export type ControlStageFormValuesDto = z.infer<
  typeof controlStageFormValuesDto
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

// изменение поручения
export const dispatchUpdate = dispatchCreate
  .pick({
    class: true,
    executorId: true,
    controllerId: true,
    dueDate: true,
    description: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
    dateDescription: z
      .string()
      .min(1, { message: 'Необходимо указать причину переноса срока' }),
  });
export type DispatchUpdateDto = z.infer<typeof dispatchUpdate>;

export const dispatchFormValuesDto = dispatchCreate
  .pick({
    caseId: true,
    class: true,
    typeId: true,
    dueDate: true,
    description: true,
    executorId: true,
  })
  .extend({
    id: z.coerce.number().nullable().default(null),
    dateDescription: z
      .string()
      .min(1, { message: 'Необходимо указать причину переноса срока' }),
    controller: z
      .literal('author')
      .or(z.literal('executor'))
      .optional()
      .default('executor'),
  });
export type DispatchFormValuesDto = z.infer<typeof dispatchFormValuesDto>;

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
    doneDate: z.coerce
      .date()
      .or(z.number())
      .or(z.string().date())
      .nullable()
      .default(null),
  });
export type ReminderUpdateDto = z.infer<typeof reminderUpdate>;

export const reminderFormValuesDto = reminderCreate
  .pick({
    caseId: true,
    class: true,
    typeId: true,
    description: true,
    observerId: true,
    dueDate: true,
  })
  .partial()
  .extend({
    id: z.coerce.number().nullable().default(null),
    doneDate: z.coerce.date().nullable().default(null),
  });
export type ReminderFormValuesDto = z.infer<typeof reminderFormValuesDto>;
