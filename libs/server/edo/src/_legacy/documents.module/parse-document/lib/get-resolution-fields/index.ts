import { type HTMLElement } from 'node-html-parser';
import {
  ResolutionData,
  ResolutionOrderData,
} from '../../types/resolution-actors-data';
import { EdoDocumentResolutionFields } from '../../../model/types/edo-document';
import {
  EdoResolution,
  EdoResolutionOrder,
} from '../../../model/types/edo-resolution';
import {
  getDate,
  getUser,
  parseEdoDate,
} from '../util/parse-edo-field-helpers';

export function getResolutionFields(
  whomResolutionsSent: ResolutionData | undefined,
  resolutionsElement: HTMLElement | undefined,
): EdoDocumentResolutionFields {
  if (!whomResolutionsSent || !resolutionsElement) return {};
  var parentResoluions: Record<number, string> = {};
  const resolutionNodes =
    resolutionsElement.querySelectorAll(`tr.resolution-item[id^='res']`) || [];

  const resolutions: EdoResolution[] = resolutionNodes
    // Парсинг верхнеуровневой резолюции
    .map((resolutionElement) => {
      const resolutionId = resolutionElement
        .getAttribute('id')
        ?.replace(/(?:res-tr-|res)/i, '');

      if (!resolutionId || !whomResolutionsSent?.[resolutionId])
        return { id: '-', level: 1 };

      return {
        id: resolutionId,
        ...getResolution(resolutionElement, whomResolutionsSent[resolutionId]),
      } as EdoResolution;
    })
    // фильтруем результаты без вменяемого id
    .filter((res) => res.id !== '-')
    // добавление свойств, зависимых от других резолюций
    .map((resolution) => {
      if (!resolution.level) return resolution;
      parentResoluions[resolution.level] = resolution.id; // Устанавливаем последнею найденную резолюцию для уровня
      return {
        ...resolution,
        parent: resolution.level && parentResoluions[resolution.level - 1], // Ставим в качестве родителя последнею замеченную резолюцию уровнем выше
      } as EdoResolution;
    });

  return { resolutions };
}

function getResolution(
  resolutionElement: HTMLElement,
  scriptData: ResolutionOrderData[],
): Omit<EdoResolution, 'id'> {
  const authorNode =
    resolutionElement.querySelector('.resolution-item__author') ||
    resolutionElement.querySelector('.resolution-item__recipient-title')
      ?.nextElementSibling;

  const author = getUser(authorNode);

  const dateNode =
    resolutionElement.querySelector(
      'div.resolution-item__header > span.resolution-item__timestamp',
    ) || undefined;

  const isCanceled =
    Boolean(
      resolutionElement.querySelector(
        '.resolution-item__vzamen:not(.resolution-item__vzamen--forward)',
      ),
    ) || undefined;

  const isVzamen =
    Boolean(
      resolutionElement.querySelector('.resolution-item__vzamen--forward'),
    ) || undefined;

  return {
    utv: resolutionElement.getAttribute('utv') === '1' ? true : false,
    level: parseInt(resolutionElement.getAttribute('data-level') || '1') || 1,
    author,
    createdAt: getDate(dateNode),
    behalfText: resolutionElement
      .querySelector('.resolution-item__behalf')
      ?.rawText?.trim(),
    isCanceled,
    isVzamen,
    orders: resolutionElement
      // Парсинг поручения внутри резолюции (order всегда есть в html, в скрипте присутствуют как массив)
      .querySelectorAll('.resolution-item__row')
      .map((orderRow) => getResolutionOrder(orderRow, scriptData))
      .filter((resolutionItem) => !!resolutionItem?.id),
  };
}

function getResolutionOrder(
  orderRow: HTMLElement,
  scriptData: ResolutionOrderData[],
): EdoResolutionOrder {
  const questionFullText = orderRow.querySelector('i')?.rawText;
  const id = orderRow.getAttribute('data-resolution_order_id');

  // находим то поручение (список исполнителей), у исполнителей которого есть нужный нам id
  const orderData = scriptData.find(
    (order) =>
      Object.entries(order)?.some(
        (user) => user[1]?.ro_id === parseInt(id || ''),
      ),
  );

  // Адресаты поручения
  const toUsers = getResolutionOrderUsers(orderRow, orderData);

  return {
    id,
    questionId:
      (questionFullText &&
        parseInt(questionFullText.match(/ (\d+)\:/i)?.[1] || '')) ||
      undefined,
    questionText:
      questionFullText && questionFullText.replace(/^вопрос \d+\: /i, ''),
    resText:
      orderRow
        .querySelector('span[axuiuserid]:last-of-type')
        ?.nextSibling?.rawText?.slice(3) || undefined,
    toUsers,
  };
}

function getResolutionOrderUsers(
  orderRow: HTMLElement | undefined,
  orderData: ResolutionOrderData | undefined,
) {
  if (!orderData) return undefined;

  return Object.entries(orderData).map(([id, user]) => {
    const dateText =
      orderRow?.querySelector(
        `.resolution-executor-history[data-resolution_to_id=${id}]`,
      )?.rawText || '';
    const doneDate = parseEdoDate(
      dateText.match(/снят с контроля: (\d{2}.\d{2}.\d{4})/i)?.[1],
    );
    const changedDate = parseEdoDate(
      dateText.match(/изменен: (\d{2}.\d{2}.\d{4})/i)?.[1],
    );
    return {
      id,
      user: {
        userId: String(user.user_id),
        userFio: user.ua_name || undefined,
        // group: String(user.group_id),
      },
      plus: user.plus === 1,
      redControl: user.another_control === 1,
      execDate: user.exec_date || undefined,
      doneDate,
      changedDate,
    };
  });
}
