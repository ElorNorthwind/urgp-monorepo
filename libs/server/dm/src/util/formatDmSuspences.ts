import { DmSuspence } from '@urgp/shared/entities';

export function formatDmSuspences(
  records: unknown[][] | undefined,
): DmSuspence[] {
  if (!records) return [];
  if (records.length === 0) return [];
  if (records[0]?.length !== 7) return [];

  return records.map((record) => {
    let termValue: number = 0;
    let termType: string = 'РД';

    if (typeof record[6] === 'string') {
      termValue = parseInt(record[6]?.slice(0, 4) ?? '0');
      termType = record[6]?.slice(4) ?? 'РД';
    }

    return {
      documentId: (record?.[0] || null) as number,
      techStageId: (record?.[1] || null) as number,
      stageName: (record?.[2] || null) as string | null,
      startDate: (record?.[3] || null) as string | null,
      dueDate: (record?.[4] || null) as string | null,
      doneDate: (record?.[5] || null) as string | null,
      termValue: Number.isInteger(termValue) ? termValue : 0,
      termType,
    };
  });
}
