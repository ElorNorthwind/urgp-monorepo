import { type HTMLElement } from 'node-html-parser';
import { EdoDocumentCardFields } from '../../../model/types/edo-document';
import { FindCardField } from './find-card-field';

export function getCardFields(card: HTMLElement): EdoDocumentCardFields {
  const find = new FindCardField(card);

  return {
    // СИНИЙ БЛОК - входящтий документ
    docInNum: find.byDataTour(1).getText(), // входящий номер документа
    docInDate: find.byDataTour(2).getDate(), // входящий дата документа
    adressedTo: find.recepients(), // получатели документа

    // ЗЕЛЕНЫЙ БЛОК - исходящий документ
    docOutNum: find.byDataTour(12).getText(), // исходящий номер документа,
    docOutDate: find.byDataTour(13).getDate(), // исходящая дата документа
    signedBy: find.byDataTour(14).getUser(), // подписант документа
    createdBy: find.byDataTour(15).getUser(), // исполнитель документа

    // ЖЕЛТЫЙ БЛОК 1 - Регистрационные данные
    docStatus: find.byTitle('статус документа:').getText(), // статус документа
    pagesCount: find.byDataTour(17).getText(), // количество листов
    docType: find.byDataTour(18).getText(), // вид документа
    deliveryType: find.byDataTour(19).getText(), // вид доставки
    specialDocType: find
      .byTitle('вид документа по особым признакам:')
      .getText(), // вид документа по особым признакам

    // Поля, пересекающиеся с обращением граждан
    curator: find.byTitle('кураторы:').getUser(), // кураторы
    summury:
      find.byDataTour(32).getText() || // краткое содержание - для обращений граждан
      find.byDataTour(20).getText(), // краткое содержание - для других случаев
    firstRegistrator: find.byDataTour(33).getUser(), // место первичной регистрации

    // Поля исполнения и отпавки
    result: find.byDataTour(61).getText(), // результат
    handSignature: find.byTitle('Собственноручная подпись').getText(), // собственноручная подпись
    isUrgent: find.byQuery(`[class^='b'][data-tour='31'] span`).getText(), // find.byDataTour(31).getText(), // срочный
    memo: find.byDataTour(25).getText(), // примечание
    info: find.byQuery(`[class^='b'][data-tour='info']`).getText(), // инфломация
    wrightOf: find.byTitle('Списано в дело').getText(), // списано в дело
    replySend: find.byTitle('Направлен ответ').getText(), // направлен ответ

    // ССЫЛКИ (из всех блоков. Внешние не реализовывал)
    linkedDocs: [
      ...find.byQuery('#linkList').getLinks('child'), // на документ ссылаются
      ...find.byDataTour(5).getLinks('parent'), // в ответ на номер
      ...find.byDataTour(6).getLinks('link'), // в ответ на номер
      ...find.byTitle('проектная работа:').getLinks('project'), // связки моей организации
    ],
  };
}
