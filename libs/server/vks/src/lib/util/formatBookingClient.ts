import { RawBookingRecord } from '@urgp/shared/entities';

export function formatBookingClient(r: RawBookingRecord): any {
  return {
    id: parseInt(
      (r?.['Тип заявителя'] === 'Физическое лицо'
        ? '1' + r?.['СНИЛС заявителя']?.match(/\d/g)?.join('') || ''
        : '2' + r?.['ОГРН (ю.л.)'] || '') || '0',
    ),
    type: r?.['Тип заявителя'],
    Surname: r?.['Фамилия заявителя'],
    FirstName: r?.['Имя заявителя'],
    LastName: r?.['Отчество заявителя'],
    OrgName: r?.['Название организации(для юридических лиц)'],
    snils: r?.['СНИЛС заявителя'],
    ogrn: r?.['ОГРН (ю.л.)'],
    inn: r?.['ИНН (ю.л.)'],
  };
}
