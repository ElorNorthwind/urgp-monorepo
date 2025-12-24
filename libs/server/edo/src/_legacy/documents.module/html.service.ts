import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EdoHttpService } from '../api.module/http.service';
import { Observable, catchError, map, tap } from 'rxjs';
import { EdoDocumentListItem } from './model/types/edo-document-list-item';
import { EdoDocument } from './model/types/edo-document';

@Injectable()
export class EdoHtmlService {
  constructor(private readonly edo: EdoHttpService) {}

  /**
   * Retrieves the HTML content of a document identified by either its ID or an EdoDocumentListItem object.
   *
   * @param {number | EdoDocumentListItem} docIdentificator - The ID of the document or an EdoDocumentListItem object.
   * @return {Observable<string>} An observable that emits the HTML content of the document.
   */
  getDocHtml(
    docIdentificator: number | EdoDocumentListItem,
  ): Observable<string> {
    const [id, linkedOrgId] =
      typeof docIdentificator === 'number'
        ? [docIdentificator, undefined]
        : [docIdentificator.documentId, docIdentificator?.linkedOrgId];

    console.time('document html ' + id);
    return this.edo
      .request<string>({
        method: 'get',
        // url: '/document.card.php',
        url: '/document.card.linked.php',
        params: { id, linked_org: linkedOrgId },
      })
      .pipe(
        tap(() => {
          console.timeEnd('document html ' + id);
        }),
        catchError((error) => {
          throw new HttpException(
            error?.response?.data || 'Failed to load document',
            error.response.status || HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
        map((res) => res.data),
      );
  }

  /**
   * Retrieves the HTML representation of the resolutions for a given ID.
   *
   * @param {number} id - The ID of the document.
   * @param {number} [tab=2] - The tab number for the resolution tree.
   * @return {Observable<string>} A string observable representing the HTML content of the resolutions.
   */
  getResolutionsHtml(id: number, tab = 2): Observable<string> {
    return this.edo
      .request<string>({
        method: 'get',
        url: '/web/?url=resolution/get/tree',
        params: { document_id: id, resolutionTreeTab: tab },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(
            error?.response?.data || 'Failed to load resolution data',
            error.response.status || HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
        map((res) => res.data),
      );
  }

  /**
   * Retrieves the HTML representation of the document list for a specific user.
   *
   * @param {number} userid - The ID of the user.
   * @param {number} [page=1] - The page number of the document list (default: 1).
   * @param {number} [status=3] - The status of the documents to retrieve (default: 3).
   * @return {Observable<string>} - An observable that emits the HTML representation of the document list.
   */
  getDocumentListHtmlByUser(
    userid: number,
    page = 1,
    status = 3,
  ): Observable<string> {
    return this.edo
      .request<string>({
        method: 'get',
        url: '/document.php',
        params: {
          signed: '',
          whole_period: 1,
          user_id: userid,
          page,
          status,
          // ajax: 1, // сокращает размер html примерно в 2 раза за счёт обёрток и лэйаута
        },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(
            error?.response?.data || 'Failed to load document list',
            error.response.status || HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
        map((res) => res.data),
      );
  }

  /**
   * Retrieves the HTML content for editing a resolution.
   *
   * @param {number} documentId - The ID of the document.
   * @param {number} [id] - The ID of the resolution edit (optional).
   * @return {Observable<string>} - The HTML content for editing the resolution.
   */
  getResolutionEditHtml(documentId: number, id?: number): Observable<string> {
    // document_resolution.edit.php?id=680495516&document_id=508507240
    return this.edo
      .request<string>({
        method: 'get',
        url: '/document_resolution.edit.php',
        params: {
          id,
          document_id: documentId,
        },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(
            error?.response?.data || 'Failed to load resolution edit data',
            error.response.status || HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
        map((res) => res.data),
      );
  }

  /**
   * Retrieves the text content of a document.
   *
   * @param {number} documentId - The ID of the document.
   * @return {Observable<EdoDocument>} An observable that emits the EdoDocument object representing the document's text content.
   */
  getDocumentText(documentId: number): Observable<EdoDocument> {
    // web/?url=document/pages/layout&id=508507240
    return this.edo
      .request<string>({
        method: 'get',
        url: '/web/',
        params: {
          url: 'document/pages/layout',
          id: documentId,
        },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(
            error?.response?.data || 'Failed to load document text',
            error.response.status || HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
        map((res) => JSON.parse(res.data)?.data),
        map((pages) => Object.values(pages).map((page: any) => page?.body)),
        map((pageBodies) => (pageBodies || []).join(' ')),
        map((fullText) => ({ documentId: documentId.toString(), fullText })),
      );
  }
}
