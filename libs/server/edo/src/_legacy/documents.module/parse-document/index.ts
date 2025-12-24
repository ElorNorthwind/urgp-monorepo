import { type EdoDocument } from '../model/types/edo-document';
import { validateDocumentHtml } from './lib/validate-document-html';
import { getCardFields } from './lib/get-card-fields';
import { getAgreetableFields } from './lib/get-agreetable-fields';
import { getFileFields } from './lib/get-file-fields';
import { getOgFields } from './lib/get-og-fields';
import { getResolutionFields } from './lib/get-resolution-fields';

export function parseDocumentFromHtml(html: string): EdoDocument {
  try {
    const documentObject = validateDocumentHtml(html);

    const cardFields = getCardFields(documentObject.card);
    const ogFields = getOgFields(documentObject.documentOg);
    const agreetableFields = getAgreetableFields(documentObject.agreetable);
    const fileFields = getFileFields(documentObject.fileList);
    const resolutionFields = getResolutionFields(
      documentObject.whomResolutionsSent,
      documentObject.resolutions,
    );

    return {
      documentId: documentObject.documentId,
      ...cardFields,
      ...ogFields,
      ...agreetableFields,
      ...fileFields,
      ...resolutionFields,
    };
  } catch (error) {
    return {
      documentId: '-',
      error,
    };
  }
}
