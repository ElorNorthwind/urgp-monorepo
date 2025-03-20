import { RdXMLFileParseResult } from '@urgp/shared/entities';

export const extractDataFromPDF = (fileName: string): RdXMLFileParseResult => {
  const rdNumPattern = /(?<=[\s_]|^)(\d+)(?=[\s_]|$)/;
  const rdDatePattern = /(?<=[\s_]|^)(\d{2}\.\d{2}\.\d{4})(?=[\s_\.]|$)/;

  const rdNum = rdNumPattern.exec(fileName)?.[1] || '';
  const rdDate = rdDatePattern.exec(fileName)?.[1] || '';

  return {
    fileName,
    rdNum,
    rdDate,
    cadNum: '',
    rdType: '',
  };
};
