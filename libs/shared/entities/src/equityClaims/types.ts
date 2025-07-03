import { z } from 'zod';
import { equityClaimStatusesValues } from './config';

const claimItemTypeSchema = z
  .object({
    id: z.coerce.number().int().nonnegative(),
    name: z.string(),
  })
  .nullable();

const claimSourceTypeSchema = z
  .object({
    id: z.coerce.number().int().nonnegative(),
    name: z.string(),
    priority: z.number(),
  })
  .nullable();

export const equityClaimSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  class: z.literal('claim').default('claim'),

  objectId: z.coerce.number().int().nonnegative(),
  isRelevant: z.coerce.boolean(),
  claimItemType: claimItemTypeSchema,
  claimSourceType: claimSourceTypeSchema,
  claimStatus: z.enum(equityClaimStatusesValues),

  // Main claim details
  claimRegistryDate: z.string().datetime().nullable().default(null), // ISO 8601 date string,
  claimRegistryNum: z.string().nullable(),
  creditorRegistryNum: z.string().nullable(),
  basis: z.string().nullable(),
  legalAct: z.string().nullable(),
  changeBasis: z.string().nullable(),
  subject: z.string().nullable(),

  // Monetary values
  sumPaid: z.number().nullable(),
  sumUnpaid: z.number().nullable(),
  sumDamages: z.number().nullable(),

  // Settlement/exclusion info
  claimSettlementReason: z.string().nullable(),
  claimSettlementDate: z.string().datetime().nullable().default(null), // ISO 8601 date string,
  claimExclusionReason: z.string().nullable(),
  claimExclusionDate: z.string().datetime().nullable().default(null), // ISO 8601 date string,

  // Creditor info
  creditorName: z.string().nullable(),
  creditorDocuments: z.string().nullable(),
  creditorAddress: z.string().nullable(),
  creditorContacts: z.string().nullable(),

  // Property details
  unit: z.string().nullable(),
  section: z.number().int().nonnegative().nullable(),
  floor: z.number().int().nullable(),
  roomCount: z.number().int().nonnegative().nullable(),
  s: z.string().nullable(), // Area value
  sectionOrder: z.number().int().nullable(),
  numProject: z.string().nullable(),

  // Metadata
  source: z.string().nullable(),
  notes: z.string().nullable(),
  identificationNotes: z.string().nullable(),
});
export type EquityClaim = z.infer<typeof equityClaimSchema>;
