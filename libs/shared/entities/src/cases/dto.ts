import { z } from 'zod';
import { externalCase, typeInfo } from '../userInput/types';

// создание заявки
export const caseCreate = z.object({
  authorId: z.coerce.number(),
  externalCases: z.array(externalCase).optional(),
  type: typeInfo,
  directions: z.array(typeInfo),
  problems: z.array(typeInfo).optional(),
  description: z
    .string()
    .min(1, { message: 'Описание проблемы не может быть пустым' }),
});
export type CaseCreateDto = z.infer<typeof caseCreate>;

export const caseCreateFormValues = caseCreate
  .pick({
    externalCases: true,
    description: true,
  })
  .extend({
    type: z.coerce.number(),
    directions: z.array(z.coerce.number()),
    problems: z.array(z.coerce.number()),
  });
export type CaseCreateFormValues = z.infer<typeof caseCreateFormValues>;

// изменение заявки
export const caseUpdate = caseCreate
  .pick({
    externalCases: true,
    type: true,
    directions: true,
    problems: true,
    description: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
  });
export type CaseUpdateDto = z.infer<typeof caseUpdate>;

export const caseUpdateFormValues = caseCreateFormValues.partial();
export type CaseUpdateFormValues = z.infer<typeof caseUpdateFormValues>;

// export const messageUpdate = z.object({
//   id: z.coerce.number(),
//   messageContent: z.string(),
//   validUntil: z.coerce.date().nullable().optional(),
//   needsAnswer: z.coerce.boolean().optional().default(false),
//   answerDate: z.coerce.date().nullable().optional(),
// });

// export const messageUpdateFormValues = messageUpdate.pick({
//   messageContent: true,
//   validUntil: true,
//   needsAnswer: true,
// });
