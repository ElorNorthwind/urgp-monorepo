import { Injectable } from '@nestjs/common';
import { EdoHtmlService } from './html.service';
import { Observable, map } from 'rxjs';
import { parseResolutionEditInfoHtml } from './parse-resolution-edit-info';
import { GetResolutionEditDataDto } from './model/dto/get-resoluton-edit-data.dts';

@Injectable()
export class EdoResolutionsService {
  constructor(private readonly html: EdoHtmlService) {}

  getResolutionEditData(
    getResolutionEditDataDto: GetResolutionEditDataDto,
  ): Observable<any> {
    const { id, documentId } = getResolutionEditDataDto;
    const result$ = this.html
      .getResolutionEditHtml(documentId, id)
      .pipe(map((html) => parseResolutionEditInfoHtml(html)));
    return result$;
  }
}
