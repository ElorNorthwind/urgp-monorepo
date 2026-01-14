import { type HTMLElement } from 'node-html-parser';
import { edoDocCardFields } from '../../config/constants';
export function parseDocCardFields(card: HTMLElement) {
  const cardFields = card?.querySelectorAll(
    'td.titles, td.titles2, td.titles3',
  );

  let fields: Record<string, any> = {};

  cardFields?.forEach((node) => {
    const title = (
      node.firstChild?.text?.trim() ||
      node?.querySelector('acronym, a, span, div')?.firstChild?.text?.trim() ||
      '-'
    )
      .replace(':', '')
      .toLowerCase();

    const f = edoDocCardFields?.[title as keyof typeof edoDocCardFields];
    if (!f) return;

    console.log(node?.nextElementSibling?.rawText?.trim());

    if (f.plural) {
      fields[f.attribute] = [
        ...(fields[f.attribute] || []),
        parseDocCardNode(node?.nextElementSibling, f?.format, f?.attribute) ??
          undefined,
      ];
    } else {
      fields[f.attribute] =
        parseDocCardNode(node?.nextElementSibling, f?.format, f?.attribute) ??
        undefined;
    }
  });

  return fields;
}

function parseDocCardNode(
  field: HTMLElement | null | undefined,
  type: string, // 'text' | 'date' | 'user' | 'doclist' | 'file',
  attribute?: string,
) {
  if (!field) return undefined;
  switch (type) {
    case 'text':
      return field?.rawText?.trim();
    case 'date':
      return field?.rawText?.trim();
    case 'user':
      const span = field.querySelector('span[axuiuserid]');
      return {
        id: span?.getAttribute('axuiuserid') || '',
        fio: span?.querySelector('b, strong')?.rawText?.trim() || '',
      };
    case 'doclist':
      const docNodes = field?.querySelectorAll('div.document-badge-list > a');
      return docNodes?.map((node) => {
        const linkText = node.getAttribute('href');
        return {
          documentId: linkText?.match(/id=([\d]+)/i)?.[1] || '',
          linkedOrg: linkText?.match(/linked_org=([\d]+)/i)?.[1],
          num: node.rawText?.match(/ *(.*?)(?:&nbsp;| )?(?:от|$)/im)?.[1],
          date:
            node?.querySelector('.document-badge__date')?.rawText ||
            node?.nextElementSibling?.tagName ||
            undefined,
          type: attribute,
        };
      });
    case 'file':
      return field?.rawText?.trim(); //TODO
  }
  return undefined;
}
