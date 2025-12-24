import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EdoRequestsService } from './edo-requests.service';
import { firstValueFrom } from 'rxjs';

@Controller('edo')
export class EdoController {
  constructor(private readonly req: EdoRequestsService) {}

  @Get('documents/:id')
  async getDocumentHtml(@Param('id', ParseIntPipe) id: number) {
    // const html = await firstValueFrom(await this.req.getDocumentHtml(id));
    // return html.match(/<title>(.*)<\/title>/);

    return this.req.getDocumentHtml(id);
  }
}
