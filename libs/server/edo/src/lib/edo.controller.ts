import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EdoRequestsService } from './edo-requests.service';
import { firstValueFrom } from 'rxjs';
import { EdoService } from './edo.service';

@Controller('edo')
export class EdoController {
  constructor(private readonly edo: EdoService) {}

  @Get('documents/:id')
  async getDocumentHtml(@Param('id', ParseIntPipe) id: number) {
    // const html = await firstValueFrom(
    //   await this.req.getDocumentHtml(id, 73594302),
    // );
    // return html.match(/<title>(.*)<\/title>/)?.[1];
    // return this.req.getDocumentHtml(id, 3349311);

    return this.edo.getDocument(id);
  }
}
