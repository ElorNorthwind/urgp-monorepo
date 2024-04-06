import { parse, valid, type HTMLElement } from 'node-html-parser';
import { EdoImportData } from '../../types/edo-import-data';
import { HttpException, HttpStatus } from '@nestjs/common';
import { OgData } from '../../types/og-data';
import { EdoFileData } from '../../types/file-data';
import { ResolutionData } from '../../types/resolution-actors-data';

export function validateDocumentHtml(
  html: string,
  parseResolutions: boolean = true,
): EdoImportData {
  // Невалидный HTML (невозможно распарсить в принципе)
  if (!valid(html))
    throw new HttpException('Invalid document HTML', HttpStatus.BAD_REQUEST);

  const body = parse(html);

  // Ответ с сообщением об ошибке доступа
  const accessError = body
    ?.querySelectorAll('div.error-block')

    ?.some((errorDiv) => errorDiv.rawText.match(/нет доступа/i));
  if (accessError)
    throw new HttpException(
      'Not authorized to view the document',
      HttpStatus.UNAUTHORIZED,
    );

  const card = body?.querySelector('#maintable, table.card') || undefined; // #maintable

  // Справедливо не для всех документов, во входящих не работает
  // const documentId = body
  //   ?.querySelector('.document-send-actions-panel')
  //   ?.nextElementSibling?.rawText?.match(/var documentId = (\d+);/i)?.[1];

  // const getDocId = (element: HTMLElement | undefined) =>
  //   element?.rawText?.match(/var documentId = (\d+);/i)?.[1];
  // const IdScript = body
  //   ?.querySelectorAll('.s-page__single > script')
  //   ?.find(getDocId);
  // const documentId = getDocId(IdScript);

  const documentId = body
    ?.querySelector('#rez-list')
    ?.getAttribute('data-document-id');

  // В ответе нет карточки или id документа
  if (!card || !documentId)
    throw new HttpException(
      'Document element not found!',
      HttpStatus.BAD_REQUEST,
    );

  const agreetable =
    body?.querySelector('tbody.agreetable__tbody') || undefined;

  let resolutions = undefined;
  let whomResolutionsSent = undefined;

  if (parseResolutions) {
    resolutions = body?.querySelector('#rez-list') || undefined;

    const whomResolutionsSentScriptElement = resolutions?.querySelector(
      '.resolution-item--script',
    )?.previousElementSibling;

    whomResolutionsSent = getObjectFromScript(
      whomResolutionsSentScriptElement,
      'whomResolutionsSent',
      'const',
    ) as ResolutionData | undefined;
  }

  const ogScriptElement =
    card?.querySelector(`#result_og`)?.previousElementSibling;

  const documentOg = getObjectFromScript(
    ogScriptElement,
    'document_og',
    'var',
  ) as OgData;

  const [fileListDocumentElement] = card?.querySelectorAll('script')?.slice(-1);

  const fileList = getObjectFromScript(
    fileListDocumentElement,
    'fileList',
    'const',
  ) as EdoFileData;

  return {
    documentId,
    card,
    agreetable,
    resolutions,
    whomResolutionsSent,
    documentOg,
    fileList,
  };
}

function getObjectFromScript(
  element: HTMLElement | undefined,
  name: 'documentId' | 'document_og' | 'whomResolutionsSent' | 'fileList',
  type: 'const' | 'var' = 'const',
): string | OgData | ResolutionData | EdoFileData | undefined {
  if (!element) return undefined;

  const json =
    element?.rawText?.match(new RegExp(`${type} ${name} = (.*?);`, 'i'))?.[1] ||
    undefined;
  if (!json) return undefined;

  try {
    const scriptObject = JSON.parse(json);
    return scriptObject;
  } catch {
    return undefined;
  }
}
