import { escapeXml } from './excapeText';

export function formatObjectsList(cadNums: string[], code: string) {
  return cadNums.map(
    (cadNum) =>
      `       <Object>
             <CadastralNumber>${escapeXml(cadNum)}</CadastralNumber>
             <FlatAssignation>
                <ns7:AssignationCode>${escapeXml(code)}</ns7:AssignationCode>
             </FlatAssignation>
          </Object>`,
  );
}
