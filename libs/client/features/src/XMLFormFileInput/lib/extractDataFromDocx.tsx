import { RdType, RdXMLFileParseResult } from '@urgp/shared/entities';
import mammoth from 'mammoth';

export const extractDataFromDocx = async (
  arrayBuffer: ArrayBuffer,
): Promise<RdXMLFileParseResult> => {
  try {
    const fileText = await mammoth.extractRawText({
      arrayBuffer,
    });

    // console.log(fileText?.value);

    let rdType = '';

    if (fileText.value.match(/нежилого\sпомещения\sв\sжилое/)) {
      rdType = RdType.PremiseToResidential;
    } else if (fileText.value.match(/исключении\sиз\sжилищного\sфонда/)) {
      rdType = RdType.PremiseToNonResidential;
    } else if (fileText.value.match(/жилого\sдома\sв\sнежилой\sфонд/)) {
      rdType = RdType.BuildingToNonResidential;
    }

    const cadNumPattern = /(\d{2}:\d{2}:\d{6,7}:\d*)/;
    const result = cadNumPattern.exec(fileText?.value || '');
    return {
      fileName: '',
      rdNum: '',
      rdDate: '',
      cadNum: result?.[1] || '',
      rdType,
    };
  } catch (error) {
    console.error('Error extracting text:', error);
    return {
      fileName: '',
      rdNum: '',
      rdDate: '',
      cadNum: '',
      rdType: '',
    };
  }
};
