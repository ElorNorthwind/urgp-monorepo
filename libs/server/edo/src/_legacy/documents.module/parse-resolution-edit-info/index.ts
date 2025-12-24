import { HttpException, HttpStatus } from '@nestjs/common';
// import { valid, parse } from 'node-html-parser';

export function parseResolutionEditInfoHtml(html: string): any {
  try {
    // // Невалидный HTML (невозможно распарсить в принципе)
    // // if (!valid(html))
    // //   throw new HttpException(
    // //     'Invalid resolution edit card HTML',
    // //     HttpStatus.BAD_REQUEST,
    // //   );
    // // html.slice(1, -1);
    // const body = parse(html);

    // // Ответ с сообщением об ошибке доступа
    // const accessError = body
    //   ?.querySelectorAll('div.error-block')
    //   ?.some((errorDiv) => errorDiv.rawText.match(/нет доступа/i));
    // if (accessError)
    //   throw new HttpException(
    //     'Not authorized to view the document',
    //     HttpStatus.UNAUTHORIZED,
    //   );

    // console.log(body?.querySelector("[id='sm-main']"));

    // const scriptStr =
    //   body
    //     ?.querySelector('#sm-main')
    //     ?.previousElementSibling?.rawText?.match(
    //       /resolution\.init\(({.*})\)/i,
    //     )?.[0] || undefined;

    // if (!scriptStr)
    //   throw new HttpException(
    //     'Invalid HTML with no script',
    //     HttpStatus.BAD_REQUEST,
    //   );

    const scriptStr =
      html.match(/resolution\.init\(({.*})\)/i)?.[1] || undefined;

    if (!scriptStr)
      throw new HttpException(
        'Invalid HTML with no script',
        HttpStatus.BAD_REQUEST,
      );

    return JSON.parse(scriptStr);
  } catch (error) {
    return {
      documentId: '-',
      error,
    };
  }
}
