import { RawBookingRecord } from '@urgp/shared/entities';
import { transformEmptyToNull } from './transformEmptyToNull';

export function formatBookingClient(r: RawBookingRecord): any {
  // Logger.debug(
  //   parseInt(
  //     (r?.['Тип заявителя'] === 'Физическое лицо'
  //       ? '1' + r?.['СНИЛС заявителя']?.match(/\d/g)?.join('') || ''
  //       : '2' + r?.['ОГРН (ю.л.)'] || '') || '0',
  //   ),
  // );
  return transformEmptyToNull({
    id: parseInt(
      (r?.['Тип заявителя'] === 'Физическое лицо'
        ? '1' + r?.['СНИЛС заявителя']?.match(/\d/g)?.join('') || ''
        : '2' + r?.['ОГРН (ю.л.)'] || '') || '0',
    ),
    type: r?.['Тип заявителя'],
    surname: r?.['Фамилия заявителя'],
    firstName: r?.['Имя заявителя'],
    lastName: r?.['Отчество заявителя'],
    orgName: r?.['Название организации(для юридических лиц)'],
    snils: r?.['СНИЛС заявителя'],
    ogrn: r?.['ОГРН (ю.л.)'],
    inn: r?.['ИНН (ю.л.)'],
  });
}
