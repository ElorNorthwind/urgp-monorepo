import { type HTMLElement } from 'node-html-parser';
import {
  EdoDocLink,
  EdoLinkType,
  EdoUserInfo,
} from '../../../model/types/edo-document';

export function getText(field: HTMLElement | undefined): string | undefined {
  return field?.rawText?.trim();
}

export function getDate(field: HTMLElement | undefined): Date | undefined {
  return parseEdoDate(field);
}

export function getUsers(field: HTMLElement | undefined): EdoUserInfo[] {
  if (!field) return [];
  const userNodes = field?.querySelectorAll('span');

  if (!userNodes || userNodes.length === 0) return [];
  return userNodes
    .filter((span) => span?.hasAttribute('axuiuserid'))
    .map((span) => {
      return {
        userId: span.getAttribute('axuiuserid') || '',
        userFio:
          span.querySelector('b, strong')?.rawText?.trim() ||
          span.rawText?.trim(),
      };
    });
}

export function getUser(
  field: HTMLElement | undefined,
): EdoUserInfo | undefined {
  const users = getUsers(field);
  if (users.length === 0) return undefined;
  return users[0];
}

export function getLinks(
  field: HTMLElement | undefined,
  type: EdoLinkType,
): EdoDocLink[] {
  if (!field) return [];
  const linkNodes = field.querySelectorAll('div.document-badge-list > a');
  if (!linkNodes || linkNodes.length === 0) return [];
  const idRegex = /id=([\d]+)/i;
  const orgRegex = /linked_org=([\d]+)/i;
  const numRegex = / *(.*?)(?:&nbsp;| )?(?:от|$)/im;

  return linkNodes
    .filter((a) => idRegex.test(a?.getAttribute('href') || ''))
    .map((node) => {
      const linkText = node.getAttribute('href');
      return {
        type,
        documentId: linkText?.match(idRegex)?.[1] || '',
        linkedOrg: linkText?.match(orgRegex)?.[1],
        num: node.rawText?.match(numRegex)?.[1],
        date: parseEdoDate(
          node.querySelector('.document-badge__date') || undefined,
        ),
      };
    });
}

export function parseEdoDate(node: HTMLElement | string | undefined) {
  const dateRe =
    /(\d{2})\.(\d{2})\.(\d{4})(?: (\d{2})\:(\d{2}))?(?:\:(\d{2}))?/i;
  const text = typeof node === 'string' ? node : node?.rawText?.trim();
  if (!text || !dateRe.test(text)) return undefined;
  const matches = text.match(dateRe);
  if (!matches || !matches[3] || !matches[2] || !matches[1]) return undefined;
  const timestamp = `${matches[3]}-${matches[2]}-${matches[1]}T${
    matches[4] || '00'
  }:${matches[5] || '00'}:${matches[6] || '00'}`;
  return new Date(timestamp);
}
