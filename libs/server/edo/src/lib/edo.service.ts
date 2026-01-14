import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { catchError, map, Observable, retry } from 'rxjs';
import { EdoAxiosRequestConfig } from '../model/types';
import { EdoRequestsService } from './edo-requests.service';
import { prepDocHtml } from './util/prepDocHtml';

@Injectable()
export class EdoService {
  private readonly logger = new Logger(EdoService.name);
  constructor(private readonly req: EdoRequestsService) {}

  public async getDocument(
    id: number,
    edoUserId?: number,
  ): Promise<Observable<any>> {
    return (await this.req.getDocumentHtml(id, edoUserId)).pipe(
      map((html) => prepDocHtml(html)),
    );
  }
}
