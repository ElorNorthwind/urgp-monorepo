import { z } from 'zod';

export const updateQuestions = z
  .object({
    id: z.coerce.number().min(1).int(),
    questionName: z.string().optional().nullable(),
    themeId: z.coerce.number().min(1).int().optional(),
    questionText: z.string().optional().nullable(),
    descriptionText: z.string().optional().nullable(),
    yandexEmbedding: z.number().array().optional().nullable(),
  })
  .array();

export type UpdateQuestionsDto = z.infer<typeof updateQuestions>;
