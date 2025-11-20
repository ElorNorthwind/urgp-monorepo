import {
  // categoryIds,
  DmDateRangeQuery,
  dmDateRangeQuerySchema,
} from '@urgp/shared/entities';

export function getDmShortTermQuery(
  categoryIds: number[],
  q: DmDateRangeQuery = {},
): string {
  const parsed = dmDateRangeQuerySchema.parse(q);
  const fromString = parsed.from
    ? `TO_DATE('${parsed.from}', 'DD.MM.YYYY')`
    : 'TRUNC(SYSDATE) - 3';
  const toString = parsed.to
    ? `TO_DATE('${parsed.to}', 'DD.MM.YYYY')`
    : 'TRUNC(SYSDATE)';

  return `
SELECT
  r.ID_RESOLUTIONS,
  r.RESOLUTION,
  r.KONTR_DATA, 
  r.ISPOL_DATA, 

  d.ID_DOCUMENTS, 
  d.REG_NUM, 
  d.FIOKTO, 
  d.REG_DATE, 
  gr.ID_RUBR
FROM DM.RESOLUTIONS r
LEFT JOIN DM.DOCUMENTS d ON r.ID_DOCUMENTS = d.ID_DOCUMENTS
LEFT JOIN DM.G_RUBR gr ON gr.ID_RUBR = d.ID_RUBR 
WHERE gr.ID_RUBR IN (${categoryIds.join(', ')})
 AND (r.KONTR_DATA BETWEEN ${fromString} AND ${toString}
   OR r.ISPOL_DATA BETWEEN ${fromString} AND ${toString})

UNION

SELECT
  r.ID_RESOLUTIONS, 
  r.RESOLUTION, 
  r.KONTR_DATA, 
  r.ISPOL_DATA, 

  d.ID_DOCUMENTS, 
  d.REG_NUM, 
  d.FIOKTO, 
  d.REG_DATE, 
  gr.ID_RUBR
FROM DM.RESOLUTIONS r
LEFT JOIN DM.DOCUMENTS d ON r.ID_DOCUMENTS = d.ID_DOCUMENTS
LEFT JOIN DM.G_RUBR gr ON gr.ID_RUBR = d.ID_RUBR 
WHERE gr.ID_RUBR IN (${categoryIds.join(', ')})
  AND d.DATA_INSERT BETWEEN ${fromString} AND ${toString} AND r.KONTR_DATA IS NOT NULL`;
}
