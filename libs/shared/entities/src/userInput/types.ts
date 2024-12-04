import { z } from 'zod';

export const approveStatusData = z.object({
  approveStatus: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  approveDate: z.coerce.date().nullable().default(null),
  approveBy: z.number().nullable().default(null),
  approveNotes: z.string().nullable().default(null),
  approver: z.coerce.number().nullable().default(null),
});
export type ApproveStatusData = z.infer<typeof approveStatusData>;
// type ApproveStatusData = {
//   approveStatus: 'pending' | 'approved' | 'rejected';
//   approveDate: Date | null;
//   approveBy: number | null;
//   approveNotes: string | null;
// };

export const basicPayloadData = approveStatusData.extend({
  updatedAt: z.coerce.date(),
  updatedBy: z.coerce.number(),
  isDeleted: z.boolean().default(false),
});
export type BasicPayloadData = z.infer<typeof basicPayloadData>;
// export type BasicPayloadData = {
//   updatedAt: Date;
//   updatedBy: number;
//   isDeleted: boolean;
// } & ApproveStatusData;

export const externalCase = z.object({
  id: z.coerce.number().or(z.string()).nullable().default(null),
  num: z.string().nullable().default(null),
  date: z.coerce.date().nullable().default(null),
  system: z.enum(['EDO', 'SPD', 'SPD2', 'HOTLINE', 'CONSULTATION', 'NONE']),
});
export type ExternalCase = z.infer<typeof externalCase>;
// export type ExternalCase = {
//   system: 'EDO' | 'SPD' | 'SPD2' | 'HotLine' | 'Consultation';
//   id: number | string | null;
//   num: string | null;
//   date: Date | null;
// };

export const typeInfo = z.object({
  id: z.coerce.number(),
  name: z.string(),
  category: z.string().nullable().optional(),
  fullname: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
});
export type TypeInfo = z.infer<typeof typeInfo>;
// export type TypeInfo = {
//   id: number;
//   name: string;
//   group?: string | null;
//   fullName?: string | null;
// };s
