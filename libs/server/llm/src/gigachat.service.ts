import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, from, catchError, map, retry } from 'rxjs';
import { EmbeddingsRequest, GPTRequest } from './model/types/llm';
import { getTokenExpirationDate } from './lib/get-token-expiration-date';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GigachatService {
  private gigaChatSessionId: string | null = null;
  private gigaChatToken: string | null = null;
  private gigaChatExpiresAt: Date | null = null;

  constructor(private readonly httpService: HttpService) {
    this.gigaChatSessionId = uuidv4();
  }

  public getGigaChatAnswer(requestParams: GPTRequest): Observable<string> {
    const { token, systemPrompt, userPrompt } = requestParams;

    throw new HttpException(
      'Модель не имплементирована',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  getGigaChatEmbeddings(
    requestParams: EmbeddingsRequest,
  ): Observable<number[]> {
    const { submodel = 'doc', token, text } = requestParams;
    throw new HttpException(
      'Модель не имплементирована',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  getGigaChatToken(): Observable<string> {
    const authData = process.env['GIGACHAT_AUTH'] || '';
    if (
      this?.gigaChatExpiresAt &&
      this?.gigaChatToken &&
      this.gigaChatExpiresAt < new Date()
    ) {
      return from(this.gigaChatToken);
    }
    return from(
      this.httpService
        .post(
          'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
          { scope: 'GIGACHAT_API_PERS' },
          {
            headers: {
              Authorization: 'Basic ' + authData,
              'Content-Type': 'application/x-www-form-urlencoded',
              RqUID: this.gigaChatSessionId,
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            throw new HttpException(
              error?.response?.data || 'Failed to getToken',
              error?.response?.status || HttpStatus.UNAUTHORIZED,
            );
          }),
          map((res) => {
            this.gigaChatToken = res?.data?.access_token;
            this.gigaChatExpiresAt = getTokenExpirationDate();
            return this?.gigaChatToken || '';
          }),
          retry(1),
        ),
    );
  }
}
