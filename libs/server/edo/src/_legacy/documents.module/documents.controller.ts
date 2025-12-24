import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import { EdoDocumentsService } from './documents.service';
import { type EdoDocument } from './model/types/edo-document';
import { EdoHtmlService } from './html.service';
import { Observable, firstValueFrom, toArray } from 'rxjs';
import {
  GetDocumentsByUserDto,
  getDocumentsByUserSchema,
} from './model/dto/get-documents-by-user.dto';
import { EdoResolutionsService } from './resolutions.service';
import {
  GetResolutionEditDataDto,
  getResolutionEditDataSchema,
} from './model/dto/get-resoluton-edit-data.dts';
import { ZodValidationPipe } from '@urgp/server/pipes';

@Controller('edo/documents')
export class EdoDocumentsController {
  constructor(
    private readonly documentsService: EdoDocumentsService,
    private readonly resolutionsService: EdoResolutionsService,
    private readonly htmlService: EdoHtmlService, // Не нужно в проде. Только для тестовых приколов
  ) {}

  @Get('/userlist')
  @UsePipes(new ZodValidationPipe(getDocumentsByUserSchema))
  getDocsByUser(
    @Query() getDocumentsByUserDto: GetDocumentsByUserDto,
  ): ReturnType<typeof this.documentsService.getDocumentsByUser> {
    const { userid, fullLinks, skipNumbers = 'согл-' } = getDocumentsByUserDto;
    return this.documentsService.getDocumentsByUser(
      userid,
      fullLinks,
      skipNumbers,
    );
  }

  @Get()
  getDocumentsByIds(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ): Observable<EdoDocument[]> {
    return this.documentsService.getDocuments(ids).pipe(toArray());
  }

  @Get('/html/:id') // Роут не нужен в проде. Только для тестовых приколов
  async getDocHtmlById(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return firstValueFrom(this.htmlService.getDocHtml(id));
  }

  @Get('/reshtml/:id') // Роут не нужен в проде. Только для тестовых приколов
  getResolutionsHtmlById(
    @Param('id', ParseIntPipe) id: number,
    @Query('tab', ParseIntPipe) tab: number,
  ): Observable<string> {
    return this.htmlService.getResolutionsHtml(id, tab);
  }

  @Get('/resedit')
  @UsePipes(new ZodValidationPipe(getResolutionEditDataSchema))
  getResolutionEditData(
    @Query() getResolutionEditDataDto: GetResolutionEditDataDto,
  ): ReturnType<typeof this.resolutionsService.getResolutionEditData> {
    return this.resolutionsService.getResolutionEditData(
      getResolutionEditDataDto,
    );
  }

  @Get('/text')
  getTextsById(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ): Observable<EdoDocument[]> {
    return this.documentsService.getTexts(ids).pipe(toArray());
  }

  @Get(':id')
  getDocById(
    @Param('id', ParseIntPipe) id: number,
  ): ReturnType<typeof this.documentsService.getDocuments> {
    return this.documentsService.getDocuments([id]);
  }

  // @Post()
  // @UsePipes(new ZodValidationPipe(createCatSchema))
  // async create(@Body() createCatDto: CreateCatDto) {
  //   this.catsService.create(createCatDto);
  // }
}
