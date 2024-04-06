import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, from, catchError, map, retry } from 'rxjs';
import {
  EmbeddingsRequest,
  GPTRequest,
  YandexRequest,
} from './model/types/llm';
import { getTokenExpirationDate } from './lib/get-token-expiration-date';

@Injectable()
export class YandexGptService {
  private yandexIAMToken: string | null = null;
  private yandexExpiresAt: Date | null = null;

  constructor(private readonly httpService: HttpService) {}

  public getYandexGptAnswer(requestParams: GPTRequest): Observable<string> {
    const { token, systemPrompt, userPrompt } = requestParams;
    const reqBody: YandexRequest = {
      modelUri: `gpt://${process.env.YANDEX_FOLDER_ID || ''}/yandexgpt-lite`,
      completionOptions: {
        stream: false,
        temperature: 0.1,
        maxTokens: '1000',
      },
      messages: [
        {
          role: 'system',
          text: systemPrompt,
        },
        {
          role: 'user',
          text: userPrompt,
        },
      ],
    };

    return from(
      this.httpService.post(
        'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
        // JSON.stringify(reqBody),
        reqBody,
        {
          headers: {
            'Content-Type': 'Application/json',
            Authorization: `Bearer ${token}`,
            'x-folder-id': process.env.YANDEX_FOLDER_ID || '',
            'x-data-logging-enablede': false,
          },
        },
      ),
    ).pipe(
      catchError((error) => {
        console.log(error);
        throw new HttpException(
          error?.response?.data || 'Failed to get Token',
          error?.response?.status || HttpStatus.UNAUTHORIZED,
        );
      }),
      map((res) => {
        return JSON.stringify(res?.data || '');
      }),
    );
  }

  getYandexGTPEmbeddings(
    requestParams: EmbeddingsRequest,
  ): Observable<number[]> {
    const { submodel = 'doc', token, text } = requestParams;
    const reqBody = {
      modelUri: `emb://${
        process.env.YANDEX_FOLDER_ID || ''
      }/text-search-${submodel}/latest`,
      text,
    };

    return from(
      this.httpService.post(
        'https://llm.api.cloud.yandex.net:443/foundationModels/v1/textEmbedding',
        reqBody,
        {
          headers: {
            'Content-Type': 'Application/json',
            Authorization: `Bearer ${token}`,
            'x-folder-id': process.env.YANDEX_FOLDER_ID || '',
            'x-data-logging-enablede': false,
          },
        },
      ),
    ).pipe(
      catchError((error) => {
        console.log(error);
        throw new HttpException(
          error?.response?.data || 'Failed to get Token',
          error?.response?.status || HttpStatus.UNAUTHORIZED,
        );
      }),
      map((res) => {
        return res?.data?.embedding;
      }),
    );
  }

  getYandexIAMToken(): Observable<string> {
    const oAuthToken = process.env.YANDEX_OAUTH_TOKEN || '';
    if (
      this?.yandexExpiresAt &&
      this?.yandexIAMToken &&
      this.yandexExpiresAt < new Date()
    ) {
      return from(this?.yandexIAMToken || '');
    }

    return from(
      this.httpService
        .post(
          'https://iam.api.cloud.yandex.net/iam/v1/tokens',
          { yandexPassportOauthToken: oAuthToken },
          {
            headers: {
              'Content-Type': 'Application/json',
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            throw new HttpException(
              error?.response?.data || 'Failed to get Token',
              error?.response?.status || HttpStatus.UNAUTHORIZED,
            );
          }),
          map((res) => {
            this.yandexIAMToken = res?.data?.iamToken;
            this.yandexExpiresAt = getTokenExpirationDate();
            return this?.yandexIAMToken || '';
          }),
          retry(2),
        ),
    );
  }
}
