import { type HTMLElement } from 'node-html-parser';
import {
  EdoDocumentAgreetableFields,
  EdoUserInfo,
} from '../../../model/types/edo-document';
import { getUser, parseEdoDate } from '../util/parse-edo-field-helpers';

export function getAgreetableFields(
  agreetableElement: HTMLElement | undefined,
): EdoDocumentAgreetableFields {
  // лист согласования вообще не передан (не найден)
  if (!agreetableElement) return {};

  const tableRows = agreetableElement.querySelectorAll(
    'tr:not(.agreetable__head):not(.agreetable__tr--redirect)',
  );

  // в листе согласования нет записей
  if (!tableRows || tableRows.length === 0) return {};

  const agreetable = tableRows
    .filter((row) => !!row)
    .map((node) => {
      const user = getUser(node.childNodes[1] as HTMLElement) || {
        userId: undefined,
        userFio: node.childNodes[1].rawText.trim(),
      };
      const status = node.childNodes[3]?.childNodes[0]?.rawText
        ?.match(/^([А-ЯЁа-яё\/ ]+)(?:\d{2}|$)/i)?.[1]
        ?.trim();
      const date = parseEdoDate(node.childNodes[3] as HTMLElement);
      const comments = node.childNodes[4]?.rawText?.trim();

      return {
        user,
        status,
        date,
        comments: comments === '-' || comments === '' ? undefined : comments,
      };
    });

  const currentSignatory = agreetable.find(
    (record) =>
      record.status?.match(/(?:подписании|согласовании)/i) &&
      record?.user?.userId,
  )?.user as EdoUserInfo;

  return { agreetable, currentSignatory };
}
