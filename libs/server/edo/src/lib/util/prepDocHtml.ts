import { HttpException, HttpStatus } from '@nestjs/common';
import { parse, valid, type HTMLElement } from 'node-html-parser';
import { parseDocCardFields } from './parseDocCardFields';

export function prepDocHtml(html: string): any {
  try {
    const body = parse(html);
    checkForErrorIndocators(body);

    const documentId = body
      ?.querySelector('#rez-list')
      ?.getAttribute('data-document-id');
    const card = body?.querySelector('#maintable') || undefined; // #maintable

    // В ответе нет карточки или id документа
    if (!card || !documentId)
      throw new HttpException(
        'Document element not found!',
        HttpStatus.NOT_FOUND,
      );

    // const agreetable =
    //   body?.querySelector('tbody.agreetable__tbody') || undefined;

    // const resolutions = body?.querySelector('#rez-list') || undefined;

    return {
      documentId: documentId,
      cardFields: parseDocCardFields(card),
      //   agreetable: agreetable?.textContent,
      //   resolutions: resolutions?.textContent,
    };
  } catch (error) {
    throw new HttpException(
      'Получен некорректный HTML документа',
      HttpStatus.BAD_REQUEST,
    );
  }
}

function checkForErrorIndocators(body: HTMLElement) {
  // Ответ с сообщением об ошибке доступа
  const accessError = body
    ?.querySelectorAll('div.error-block')
    ?.some((errorDiv) => errorDiv.rawText.match(/нет доступа/i));
  const loginDiv = body?.querySelector('#login-mosedo-root');
  if (accessError || loginDiv)
    throw new HttpException('Нет доступа к документу', HttpStatus.UNAUTHORIZED);
}

// function getObjectFromScript(
//   element: HTMLElement | null | undefined,
//   name: 'documentId' | 'document_og' | 'whomResolutionsSent' | 'fileList',
//   type: 'const' | 'var' = 'const',
// ): string | OgData | ResolutionData | EdoFileData | undefined {
//   if (!element) return undefined;

//   const json =
//     element?.rawText?.match(new RegExp(`${type} ${name} = (.*?);`, 'i'))?.[1] ||
//     undefined;
//   if (!json) return undefined;

//   try {
//     const scriptObject = JSON.parse(json);
//     return scriptObject;
//   } catch {
//     return undefined;
//   }
// }
