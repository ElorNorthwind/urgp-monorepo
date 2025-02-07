import { z } from 'zod';
import { approveStatusValues } from './config';

// export const approveStatusSchema = z
//   .enum(['project', 'approved', 'pending', 'rejected'])
//   .default('project');
// export type ApproveStatus = z.infer<typeof approveStatusSchema>;

export const caseClassSchema = z
  .enum(['control-incident'])
  .default('control-incident');
export type CaseClass = z.infer<typeof caseClassSchema>;

export const operationClassSchema = z
  .enum(['stage', 'dispatch', 'reminder'])
  .default('stage');
export type OperationClass = z.infer<typeof operationClassSchema>;

export const entityClassSchema = caseClassSchema.or(operationClassSchema);
// .default('control-incident');
export type EntityClass = z.infer<typeof entityClassSchema>;

export const externalCaseSchema = z
  .object({
    id: z.coerce.number().or(z.string()).nullable().default(null),
    num: z.string().nullable().default(null),
    date: z.string().datetime().nullable().default(null),
    system: z.enum(['EDO', 'SPD', 'SPD2', 'HOTLINE', 'CONSULTATION', 'NONE']),
  })
  .refine(
    ({ system, num }) => !['EDO', 'SPD', 'SPD2'].includes(system) || !!num,
    { message: 'Внешний номер обязателен для систем ЭДО и СПД', path: ['num'] },
  );
export type ExternalCase = z.infer<typeof externalCaseSchema>;

export const classificatorSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  category: z.string().nullable().optional(),
  fullname: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  priority: z.coerce.number().nullable().optional(),
  autoApprove: z.coerce.boolean().nullable().optional(),
});
export type Classificator = z.infer<typeof classificatorSchema>;

export const userInfoSchema = z.object({
  id: z.coerce.number(),
  fio: z.string(),
  priority: z.coerce.number().nullable().optional(),
});
export type UserInfo = z.infer<typeof userInfoSchema>;

export const entitySlimSchema = z.object({
  id: z.number().int().positive(), // Positive integer
  // class: entityClassSchema,
  typeId: z.number().int().positive(),
  authorId: z.number().int().positive(),
  updatedById: z.number().int().positive().nullable(),
  approveFromId: z.number().int().positive().nullable(),
  approveToId: z.number().int().positive().nullable(),
  approveStatus: z.enum(approveStatusValues).default('project'),
  approveDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  approveNotes: z.string().nullable().default(null),
  createdAt: z.string().datetime(), // ISO 8601 date string
  updatedAt: z.string().datetime().nullable().default(null), // ISO 8601 date string
  title: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  extra: z.string().nullable().default(null),
});
export type EntitySlim = z.infer<typeof entitySlimSchema>;

export const entityFullSchema = entitySlimSchema
  .omit({
    typeId: true,
    authorId: true,
    updatedById: true,
    approveFromId: true,
    approveToId: true,
  })
  .extend({
    type: classificatorSchema,
    author: userInfoSchema,
    updatedBy: userInfoSchema.nullable().default(null),
    approveFrom: userInfoSchema.nullable().default(null),
    approveTo: userInfoSchema.nullable().default(null),
  });
export type EntityFull = z.infer<typeof entityFullSchema>;
export type EntityApproveData = Pick<
  EntityFull,
  'approveStatus' | 'approveDate' | 'approveNotes' | 'approveFrom' | 'approveTo'
>;

// Чисто для всяких селектов в интерфейсах
export const classificatorInfoSchema = classificatorSchema
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
    defaultExecutorId: z.coerce.number().nullable().optional(),
  });
export type ClassificatorInfo = z.infer<typeof classificatorInfoSchema>;

export const classificatorInfoStringSchema = classificatorInfoSchema
  .omit({ value: true })
  .extend({
    value: z.string(),
  });
export type ClassificatorInfoString = z.infer<
  typeof classificatorInfoStringSchema
>;

export const nestedClassificatorInfoSchema = z.object({
  value: z.string(),
  label: z.string(),
  items: z.array(classificatorInfoSchema),
});
export type NestedClassificatorInfo = z.infer<
  typeof nestedClassificatorInfoSchema
>;

export const nestedClassificatorInfoString = z.object({
  value: z.string(),
  label: z.string(),
  items: z.array(classificatorInfoStringSchema),
});
export type NestedClassificatorInfoString = z.infer<
  typeof nestedClassificatorInfoString
>;

// export const approveStatusData = approveStatusDataSlim
//   .omit({
//     approveById: true,
//     approverId: true,
//   })
//   .extend({
//     approver: userInfo,
//     approveBy: userInfo,
//   });
// export type ApproveStatusData = z.infer<typeof approveStatusData>;
