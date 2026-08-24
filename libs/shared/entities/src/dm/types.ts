import { z } from 'zod';

export type DmRecord = {
  resolutionId: number | null;
  resolutionText: string | null;
  controlDate: string | null;
  doneDate: string | null;
  documentId: number | null;
  registrationNumber: string | null;
  fromFio: string | null;
  registrationDate: string | null;
  categoryId: number | null;
  planDueDate: string | null;
};

export type DmSuspence = {
  documentId: number;
  techStageId: number;
  stageName: string | null;
  startDate: string | null;
  dueDate: string | null;
  doneDate: string | null;
  termValue: number | null;
  termType: string | null;
};

export const updateStatusSchema = z.object({
  name: z.string().min(1),
  state: z.enum(['idle', 'running', 'completed', 'failed']),
  progress: z.number().int().min(0).max(100),
  message: z.string().nullable().optional(),
  startedAt: z.string().datetime().or(z.date()).nullable().optional(),
  completetAt: z.string().datetime().or(z.date()).nullable().optional(),
});

export type UpdateStatus = z.infer<typeof updateStatusSchema>;

export const UPDATE_STATES: Record<string, UpdateStatus['state']> = {
  IDLE: 'idle',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;
