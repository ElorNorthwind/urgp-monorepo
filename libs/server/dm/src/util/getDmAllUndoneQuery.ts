// import { categoryIds } from '@urgp/shared/entities';

export function getDmAllUndoneQuery(categoryIds: number[]): string {
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
 AND r.KONTR_DATA IS NOT NULL AND r.ISPOL_DATA IS NULL`;
}
