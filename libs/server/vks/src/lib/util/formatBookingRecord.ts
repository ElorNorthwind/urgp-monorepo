import { RawBookingRecord } from '@urgp/shared/entities';
import {
  booringReportAdditionalFields,
  getAdditionalField,
} from './getAdditionalField';

export function formatBookingRecord(r: RawBookingRecord): any {
  return {
    org: r?.['Отделение'],
    date: r?.['Дата записи'],
    time: r?.['Время записи'],

    serviceId: parseInt(r?.['id услуги'] || '0'),
    serviceName: r?.['Услуга'],

    status: r?.['Статус'],
    caseCount: parseInt(r?.['Количество дел'] || '0'),

    bookingId: parseInt(r?.['booking_id'] || '0'),
    bookingDate: r?.['Дата и время создания брони'],
    bookingCode: r?.['Код бронирования'],
    bookingSource: r?.['Запись произведена'],
    bookingResource: r?.['Ресурс предварительной записи'],

    tikenNum: r?.['Номер талона'],
    tiketCallTime: r?.['Время вызова талона'],
    tiketCancelUserTime: r?.['Время отмены записи пользователем'],
    tiketCancelOivTime: r?.['Время отмены записи ОИВ'],
    // tiketAdditionalFields: r?.['Дополнительные поля'],

    deputyFio: r?.['ФИО представителя'],
    phone: r?.['Телефон заявителя/представителя'],
    email: r?.['Адрес электронной почты заявителя/представителя'],

    ...Object.keys(booringReportAdditionalFields).reduce((obj, key) => {
      return {
        ...obj,
        [key]: getAdditionalField(
          r?.['Дополнительные поля'],
          key as keyof typeof booringReportAdditionalFields,
        ),
      };
    }, {}),
    clientId: parseInt(
      (r?.['Тип заявителя'] === 'Физическое лицо'
        ? '1' + r?.['СНИЛС заявителя']?.match(/\d/g)?.join('') || ''
        : '2' + r?.['ОГРН (ю.л.)'] || '') || '0',
    ),
    // client: {
    //   id: parseInt(
    //     (r?.['Тип заявителя'] === 'Физическое лицо'
    //       ? '1' + r?.['СНИЛС заявителя']?.match(/\d/g)?.join('') || ''
    //       : '2' + r?.['ОГРН (ю.л.)'] || '') || '0',
    //   ),
    //   type: r?.['Тип заявителя'],
    //   Surname: r?.['Фамилия заявителя'],
    //   FirstName: r?.['Имя заявителя'],
    //   LastName: r?.['Отчество заявителя'],
    //   OrgName: r?.['Название организации(для юридических лиц)'],
    //   snils: r?.['СНИЛС заявителя'],
    //   ogrn: r?.['ОГРН (ю.л.)'],
    //   inn: r?.['ИНН (ю.л.)'],
    // },
  };
}
