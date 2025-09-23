import { ApartmentDefectData } from '@urgp/shared/entities';
import { toDate } from 'date-fns';
import { convertExcelSerial } from './convertExcelSerial';

export function parseDefectsExcel(data: any[]): ApartmentDefectData[] {
  // console.log(convertExcelSerial(data[0]['Дата получения обращения']));
  // console.log(convertExcelSerial(data[0]['Дата взятия в работу']));

  return data
    .map((item: any) => ({
      unom: item['Уном заселяемого дома']
        ? Number(item['Уном заселяемого дома'])
        : 0,

      apartmentNum: item['Номер заселяемой квартиры']
        ? String(item['Номер заселяемой квартиры'])
        : '',

      complaintDate: convertExcelSerial(item['Дата получения обращения']),

      entryDate: convertExcelSerial(item['Дата заведения']),

      changedDoneDate: convertExcelSerial(
        item['Дата завершения работ (после переносов)'],
      ),

      actualDoneDate: convertExcelSerial(
        item['Дата завершения работ (фактическая)'],
      ),

      isDone:
        item['Выполнено'] !== undefined ? Boolean(item['Выполнено']) : null,

      description:
        [
          item['Подъезд и входная дверь'],
          item['Прихожая'],
          item['Ванная'],
          item['Совмещенные ванная/туалет'],
          item['Туалет'],
          item['Кухня'],
          item['Комната 1'],
          item['Комната 2'],
          item['Комната 3'],
          item['Комната 4'],
          item['Лоджия или балкон'],
          item['Окна'],
          item['Подоконные доски'],
          item['Прочие дефекты'],
        ]
          .filter((desc) => desc && desc !== '')
          .join('; ')
          .trim() || null,

      url: item['Ссылка'] ? String(item['Ссылка']) : null,
    }))
    .filter((item) => item.unom !== 0);
}
