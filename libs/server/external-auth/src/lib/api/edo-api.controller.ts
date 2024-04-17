import { Controller, Get } from '@nestjs/common';
import { EdoHttpService } from './edo-http-service';
import { Observable, map, tap } from 'rxjs';

@Controller('ext/auth/edo')
export class EdoTestController {
  constructor(private readonly edo: EdoHttpService) {}

  @Get('doc-test')
  getEdoTestDoc(): Observable<string> {
    const id = 521378355;

    console.time('document html ' + id);
    return this.edo
      .request<string>({
        method: 'get',
        url: '/document.card.linked.php',
        params: { id },
      })
      .pipe(
        tap(() => {
          console.timeEnd('document html ' + id);
        }),
        map((res) => res.data),
      );
  }
}
