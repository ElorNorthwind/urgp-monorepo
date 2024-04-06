import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Observable,
  bufferCount,
  defaultIfEmpty,
  delayWhen,
  firstValueFrom,
  from,
  interval,
  isEmpty,
  map,
  mergeAll,
  mergeMap,
  of,
  toArray,
  zip,
} from 'rxjs';
import {
  EmbeddingsRequestWithModel,
  GPTRequestWithModel,
} from './model/types/llm';
import { YandexGptService } from './yandex.service';
import { GigachatService } from './gigachat.service';
import { DatabaseService, DbQuestion } from '@urgp/server/database';
import { EdoHtmlService } from '@urgp/server/edo';

@Injectable()
export class GptService {
  constructor(
    private readonly yandexGptService: YandexGptService,
    private readonly gigaChatService: GigachatService,
    private readonly dbService: DatabaseService,
    private readonly edoHtml: EdoHtmlService,
  ) {}

  public getGTPAnswer(requestParams: GPTRequestWithModel): Observable<string> {
    const { model = 'yandex', systemPrompt, userPrompt } = requestParams;

    switch (model) {
      case 'yandex':
        return this.yandexGptService.getYandexIAMToken().pipe(
          mergeMap((token) => {
            return this.yandexGptService.getYandexGptAnswer({
              token,
              systemPrompt,
              userPrompt,
            });
          }),
        );

      case 'sber':
        return this.gigaChatService.getGigaChatToken().pipe(
          mergeMap((token) => {
            return this.gigaChatService.getGigaChatAnswer({
              token,
              systemPrompt,
              userPrompt,
            });
          }),
        );

      default:
        throw new HttpException('Модель не выбрана', HttpStatus.BAD_REQUEST);
    }
  }

  public getEmbeddings(
    requestParams: EmbeddingsRequestWithModel,
  ): Observable<number[]> {
    const { model = 'yandex', submodel = 'doc', text } = requestParams;

    switch (model) {
      case 'yandex':
        return this.yandexGptService.getYandexIAMToken().pipe(
          mergeMap((token) => {
            return this.yandexGptService.getYandexGTPEmbeddings({
              submodel,
              token,
              text,
            });
          }),
        );
      case 'sber':
        return this.gigaChatService.getGigaChatToken().pipe(
          mergeMap((token) => {
            return this.gigaChatService.getGigaChatEmbeddings({
              token,
              text,
            });
          }),
        );
      default:
        throw new HttpException('Модель не выбрана', HttpStatus.BAD_REQUEST);
    }
  }

  public embedQuestions(): Observable<DbQuestion[]> {
    const questions = this.dbService.db.questions.unembedded() as Promise<
      DbQuestion[]
    >;

    const batchedQuestions$ = from(questions).pipe(
      mergeMap((q) => q),
      bufferCount(10),
      delayWhen((_, i) => interval(i * 1100)),
      mergeAll(),
    );

    const embeddedQuestions$ = batchedQuestions$.pipe(
      map(async (question) => {
        const embeddings = await firstValueFrom(
          this.getEmbeddings({
            model: 'yandex',
            submodel: 'doc',
            text: question.descriptionText || '',
          }),
        );
        return {
          id: question.id,
          yandexEmbedding: embeddings,
        };
      }),
      mergeMap((q) => q),
      toArray(),
    );

    return embeddedQuestions$.pipe(
      mergeMap(async (records) => {
        if (!records || records.length === 0) return [];
        return await this.dbService.db.questions.update(records);
      }),
    );
  }

  public getQuestionRanking(documentId: number): Observable<DbQuestion[]> {
    // const text = this.edoHtml.getDocumentText(documentId);
    return this.edoHtml.getDocumentText(documentId).pipe(
      map((doc) => {
        if (!doc || !doc?.fullText) {
          throw new HttpException(
            'Текст документа не доступен',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return doc.fullText.trim().substring(0, 4000);
      }),
      mergeMap((t) => {
        return this.getEmbeddings({
          text: t,
          model: 'yandex',
          submodel: 'doc',
        });
      }),
      mergeMap((emb) => {
        return this.dbService.db.questions.byEmbeddings(emb) as Promise<
          DbQuestion[]
        >;
      }),
    );
  }

  public classifyDocument(documentId: number): Observable<string> {
    const text$ = this.edoHtml.getDocumentText(documentId).pipe(
      map((doc) => {
        if (!doc || !doc?.fullText) {
          throw new HttpException(
            'Текст документа не доступен',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return doc.fullText.trim().substring(0, 4000);
      }),
    );
    const token$ = this.yandexGptService.getYandexIAMToken();
    // const systemPrompt$ = from(
    //   this.dbService.db.questions.descriptioned(),
    // ).pipe(
    //   mergeMap((questionList: DbQuestion[]) => {
    //     return questionList
    //       .sort((a, b) => a.id - b.id)
    //       .map((q) => {
    //         return q.id.toString() + '. ' + q.descriptionText;
    //       });
    //   }),
    //   toArray(),
    //   map((questions) => {
    //     return `Представь краткое содержание документа (одним предложением) и определи, затронут ли в нём один из этих вопросов:
    //     ${questions.join(`;
    //     `)}.
    //     Ответ давай строго в форме JSON объекта { resume: <краткое содержание>, question: <номер вопроса> }, например:
    //     { resume: "Заявитель просит поставить его на жилищный учёт", question: 1 } или { resume: "Предложение о совместной работе", question: Null }
    //     Если ни один из вопросов не подходит - указывай Null.`;
    //   }),
    // );

    const systemPrompt$ = from(
      `Кроатко опиши суть представленного текста. Отвечай одним предложением, без дополнительных пояснений.`,
    );

    return zip(text$, systemPrompt$, token$).pipe(
      mergeMap(([userPrompt, systemPrompt, token]) => {
        // console.log(systemPrompt);
        return this.yandexGptService.getYandexGptAnswer({
          systemPrompt,
          userPrompt,
          token,
        });
      }),
      map((answer) => {
        console.log(JSON.parse(answer).result.usage);
        return JSON.parse(answer)?.result?.alternatives?.reduce(
          (acc: string, value: any) => {
            return acc + ' ' + value.message.text;
          },
          '',
        );

        // {"result":{"alternatives":[{"message":{"role":"assistant","text":"{ resume: \"Предложение о совместной работе по
        // использованию технологий искусственного интеллекта в деятельности органов исполнительной власти Москвы.\", number: 2
        // }"},"status":"ALTERNATIVE_STATUS_FINAL"}],"usage":{"inputTextTokens":"527","completionTokens":"25","totalTokens":"552"},"modelVersion":"18.01.2024"}}
      }),
    );
  }
}
