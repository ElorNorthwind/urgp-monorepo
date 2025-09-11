import { DmRecord } from '../model/types';

export function mapDmRecord(record: Array<string | number>): DmRecord {
  return {
    resolutionId: (record?.[0] || null) as number | null,
    resolutionText: (record?.[1] || null) as string | null,
    controlDate: (record?.[2] || null) as string | null,
    doneDate: (record?.[3] || null) as string | null,

    documentId: (record?.[4] || null) as number | null,
    registrationNumber: (record?.[5] || null) as string | null,
    fromFio: (record?.[6] || null) as string | null,
    registrationDate: (record?.[7] || null) as string | null,

    categoryId: (record?.[8] || null) as number | null,
  };
}
