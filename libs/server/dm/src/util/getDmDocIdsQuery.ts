export function getDmDocIdsQuery(ids: number[]): string {
  return `
SELECT
  r.ID_RESOLUTIONS,
  r.RESOLUTION,
  r.KONTR_DATA, 
  r.ISPOL_DATA, 
  r.ID_DOCUMENTS, 
  d.RN, 
  d.FIOKTO, 
  d.REG_DATE, 
  gr.ID_RUBR
FROM DM.RESOLUTIONS r
LEFT JOIN DM.DOCUMENTS d ON r.ID_DOCUMENTS = d.ID_DOCUMENTS
LEFT JOIN DM.G_RUBR gr ON gr.ID_RUBR = d.ID_RUBR 
WHERE r.ID_DOCUMENTS IN (${ids.join(', ')})`;
}
