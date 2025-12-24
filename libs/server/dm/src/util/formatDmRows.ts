import { DmRecord } from '@urgp/shared/entities';

export function formatDmRows(records: unknown[][] | undefined): DmRecord[] {
  if (!records) return [];
  if (records.length === 0) return [];
  if (records[0]?.length !== 9) return [];

  return records.map((record) => {
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
  });
}

// r.ID_RESOLUTIONS, 0
// r.RESOLUTION, 1
// r.KONTR_DATA, 2
// r.ISPOL_DATA, 3

// d.ID_DOCUMENTS, 4
// d.RN, 5
// d.FIOKTO, 6
// d.REG_DATE, 7
// gr.ID_RUBR 8
