import { Injectable } from '@nestjs/common';
import {
  Observable,
  concat,
  concatMap,
  defer,
  distinct,
  filter,
  firstValueFrom,
  from,
  map,
  mergeMap,
  of,
  repeat,
  takeWhile,
  toArray,
} from 'rxjs';
import { parseDocumentFromHtml } from './parse-document';
import {
  EdoDocLink,
  EdoDocument,
  EdoLinkType,
} from './model/types/edo-document';
import { parseDocumentListFromHtml } from './parse-document-list';
import { EdoHtmlService } from './html.service';
import { EdoDocumentListItem } from './model/types/edo-document-list-item';

@Injectable()
export class EdoDocumentsService {
  constructor(private readonly html: EdoHtmlService) {}

  getDocumentListByUser(
    userid: number,
    skipNumners?: string,
  ): Observable<EdoDocumentListItem[]> {
    const statusesToCheck = [3, 2, 1];
    const currentPagesForStatuses: Record<number, number> = {};
    statusesToCheck.forEach((status) => (currentPagesForStatuses[status] = 1));
    const statuses = from(statusesToCheck);

    return statuses.pipe(
      mergeMap((status) => {
        return defer(() =>
          this.html.getDocumentListHtmlByUser(
            userid,
            currentPagesForStatuses[status],
            status,
          ),
        ).pipe(
          map((html) => {
            const docList = parseDocumentListFromHtml(html);
            currentPagesForStatuses[status] += 1;
            return docList;
          }),
          repeat(),
          takeWhile((docList) => docList.hasMore),
          concatMap((docList) => docList.documents), // по идее, можно и mergeMap, один хер repeat поочереди вызывает...
          filter((doc) => {
            // удаляем номера, отвечающие маске игнора
            if (!skipNumners) return true;
            const docNumber = doc.docInNum || doc.docOutNum || '-';
            return !docNumber.match(new RegExp(skipNumners, 'i'));
          }),
          toArray(),
        );
      }),
    );
  }

  async getDocumentsByUser(
    userid: number,
    fullLinks: boolean = false,
    skipNumners?: string,
  ): Promise<EdoDocument[]> {
    const docs$ = from(this.getDocumentListByUser(userid, skipNumners)).pipe(
      mergeMap((listItems) => this.getDocuments(listItems)),
      toArray(),
    );

    const docs = await firstValueFrom(docs$);

    if (fullLinks) {
      return await firstValueFrom(this.addDocumentsLinks(docs, ['parent']));
    }

    return docs;
  }

  getDocuments(
    ids: Array<number | EdoDocumentListItem>,
  ): Observable<EdoDocument> {
    const MAX_CONCURRENT_REQUESTS = parseInt(
      process.env.EDO_MAX_CONCURRENT_REQUESTS || '10',
    );

    const result$ = from(ids).pipe(
      mergeMap((id) => this.html.getDocHtml(id), MAX_CONCURRENT_REQUESTS),
      map((html) => parseDocumentFromHtml(html)),
    );

    return result$;
  }

  getTexts(ids: Array<number>): Observable<EdoDocument> {
    const MAX_CONCURRENT_REQUESTS = parseInt(
      process.env.EDO_MAX_CONCURRENT_REQUESTS || '10',
    );

    const result$ = from(ids).pipe(
      mergeMap((id) => this.html.getDocumentText(id), MAX_CONCURRENT_REQUESTS),
    );

    return result$;
  }

  addDocumentsLinks(
    documents: EdoDocument[],
    linkTypes?: EdoLinkType[],
  ): Observable<EdoDocument[]> {
    // Если не представлен список типа ссылок - берём все. Иначе - только запрошенного типа
    const linkFilter = (link: EdoDocLink) => {
      if (!linkTypes) return true;
      return linkTypes.some((type) => link.type === type);
    };

    // синхронная функция, дополняющая списки ссылок в документах
    const insertDocList = (
      originalDocs: EdoDocument[],
      linkedDocumentsToAdd: EdoDocument[],
    ) => {
      return originalDocs.map((doc) => {
        if (!doc.linkedDocs) return doc;
        const updatedLinkedDocs = doc.linkedDocs.map((linkedDoc) => ({
          ...linkedDoc,
          document: linkedDocumentsToAdd.find(
            (link) => link.documentId === linkedDoc.documentId,
          ),
        }));
        return { ...doc, linkedDocs: updatedLinkedDocs } as EdoDocument;
      });
    };

    // Поток всех потенциальных документов для добавления. По идее, надо его ждать в любом случае...
    const links$ = from(documents).pipe(
      mergeMap((link) => from(link.linkedDocs?.filter(linkFilter) || [])),
      distinct((link) => link.documentId),
      filter(
        (link) => !documents.some((doc) => doc.documentId === link.documentId),
      ), // не перезапрашивать документы если они есть в изначальном списке
      map(
        (link) =>
          ({
            documentId: parseInt(link.documentId),
            linkedOrgId: link?.linkedOrg
              ? parseInt(link.linkedOrg) || undefined
              : undefined,
          }) as EdoDocumentListItem,
      ),
      toArray(),
      mergeMap((listItems) => this.getDocuments(listItems)), // получаем новые документы
      toArray(),
      (list) => concat(list, of(documents)), // добавить в список доступных ссылок документы из первоначального списка
      map((allLinkedDocuments) => insertDocList(documents, allLinkedDocuments)),
    );

    return links$;
  }
}
