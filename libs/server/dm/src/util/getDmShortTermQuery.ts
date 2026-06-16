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
  d.RN, 
  d.FIOKTO, 
  d.REG_DATE, 
  gr.ID_RUBR,
  et.DATA_PLAN
FROM DM.RESOLUTIONS r
LEFT JOIN DM.DOCUMENTS d ON r.ID_DOCUMENTS = d.ID_DOCUMENTS
LEFT JOIN DM.G_RUBR gr ON gr.ID_RUBR = d.ID_RUBR 
LEFT JOIN (
SELECT 
	ed.ID_DOCUMENTS,
	ed.DATA_PLAN
FROM DM.ETAPS_DOC ed 
LEFT JOIN DM.ETAPS_TECHPROC et ON et.ID_ETAPTECHPROC = ed.ID_ETAPTECHPROC
LEFT JOIN DM.G_ETAPS ge ON ge.ID_ETAP = et.ID_ETAP
WHERE ge.TYPE_ETAP = 3
) et ON et.ID_DOCUMENTS = r.ID_DOCUMENTS
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
  d.RN, 
  d.FIOKTO, 
  d.REG_DATE, 
  gr.ID_RUBR,
  et.DATA_PLAN
FROM DM.RESOLUTIONS r
LEFT JOIN DM.DOCUMENTS d ON r.ID_DOCUMENTS = d.ID_DOCUMENTS
LEFT JOIN DM.G_RUBR gr ON gr.ID_RUBR = d.ID_RUBR 
LEFT JOIN (
SELECT 
	ed.ID_DOCUMENTS,
	ed.DATA_PLAN
FROM DM.ETAPS_DOC ed 
LEFT JOIN DM.ETAPS_TECHPROC et ON et.ID_ETAPTECHPROC = ed.ID_ETAPTECHPROC
LEFT JOIN DM.G_ETAPS ge ON ge.ID_ETAP = et.ID_ETAP
WHERE ge.TYPE_ETAP = 3
) et ON et.ID_DOCUMENTS = r.ID_DOCUMENTS
WHERE gr.ID_RUBR IN (${categoryIds.join(', ')})
  AND d.DATA_INSERT BETWEEN ${fromString} AND ${toString} AND r.KONTR_DATA IS NOT NULL`;
}
