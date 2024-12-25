import { z } from 'zod';

export const approveStatusData = z.object({
  approveStatus: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  approveDate: z.coerce.date().nullable().default(null),
  approveBy: z.number().nullable().default(null),
  approveNotes: z.string().nullable().default(null),
  approver: z.coerce.number().nullable().default(null),
});
export type ApproveStatusData = z.infer<typeof approveStatusData>;

export const basicPayloadData = approveStatusData.extend({
  updatedAt: z.coerce.date(),
  updatedBy: z.coerce.number(),
  isDeleted: z.boolean().default(false),
});
export type BasicPayloadData = z.infer<typeof basicPayloadData>;

export const externalCase = z
  .object({
    id: z.coerce.number().or(z.string()).nullable().default(null).optional(),
    num: z.string().nullable().default(null),
    date: z.coerce.date().nullable().default(null),
    system: z.enum(['EDO', 'SPD', 'SPD2', 'HOTLINE', 'CONSULTATION', 'NONE']),
  })
  .refine(
    ({ system, num }) => !['EDO', 'SPD', 'SPD2'].includes(system) || !!num,
    { message: 'Внешний номер обязателен для систем ЭДО и СПД', path: ['num'] },
  );
export type ExternalCase = z.infer<typeof externalCase>;

export const typeInfo = z.object({
  id: z.coerce.number(),
  name: z.string(),
  category: z.string().nullable().optional(),
  fullname: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  priority: z.coerce.number().nullable().optional(),
  autoApprove: z.coerce.boolean().nullable().optional(),
});
export type TypeInfo = z.infer<typeof typeInfo>;

export const userInfo = z.object({
  id: z.coerce.number().nullable(),
  fio: z.string().nullable(),
});
export type UserInfo = z.infer<typeof userInfo>;

export const classificatorInfo = typeInfo
  .omit({
    id: true,
    name: true,
    fullname: true,
    tags: true,
  })
  .extend({
    value: z.coerce.number(),
    label: z.string(),
    fullname: z.string(),
    tags: z.array(z.string()),
    category: z.string(),
  });
export type ClassificatorInfo = z.infer<typeof classificatorInfo>;

export const nestedClassificatorInfo = z.object({
  value: z.string(),
  label: z.string(),
  items: z.array(classificatorInfo),
});
export type NestedClassificatorInfo = z.infer<typeof nestedClassificatorInfo>;
