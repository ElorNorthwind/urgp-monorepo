import { valid, parse } from 'node-html-parser';
import { parseEdoDate } from '../parse-document/lib/util/parse-edo-field-helpers';
import { EdoDocumentListItem } from '../model/types/edo-document-list-item';

type EdoDocumentListData = {
  documents: EdoDocumentListItem[];
  hasMore: boolean;
};

/**
 * Parses a document list from HTML and returns the parsed data.
 *
 * @param {string} html - The HTML to parse.
 * @return {EdoDocumentListData} The parsed document list data.
 */
export function parseDocumentListFromHtml(html: string): EdoDocumentListData {
  // Невалидный HTML (невозможно распарсить в принципе)
  if (!valid(html)) return { documents: [], hasMore: false }; // throw new HttpException('Invalid document list HTML', HttpStatus.BAD_REQUEST);
  const body = parse(html);

  const documentElements = body.querySelectorAll(
    '#mtable>tbody>tr.document-list__tr',
  );

  const foundDocs = documentElements.map((documentElement) => {
    const documentId = parseInt(
      documentElement.getAttribute('data-docid') || '',
    );
    const docInElement = documentElement.querySelector('.s-table__clamping');
    const docOutElement = documentElement.querySelector('.s-table__clamping');

    const docInNum = docInElement?.childNodes?.[1]?.rawText?.trim();
    const docInDate = parseEdoDate(docInElement?.lastChild?.rawText);
    const docOutNum = docOutElement?.childNodes?.[1].rawText?.trim();
    const docOutDate = parseEdoDate(docOutElement?.lastChild?.rawText);

    return { documentId, docInNum, docInDate, docOutNum, docOutDate };
  });

  return { documents: foundDocs, hasMore: foundDocs.length > 0 };
}
