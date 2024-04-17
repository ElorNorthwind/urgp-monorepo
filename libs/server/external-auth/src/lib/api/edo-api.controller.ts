import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { EdoHttpService } from './edo-http-service';
import { Observable, catchError, map, tap } from 'rxjs';

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
        // url: '/document.card.php',
        url: '/document.card.linked.php',
        params: { id },
      })
      .pipe(
        tap(() => {
          console.timeEnd('document html ' + id);
        }),
        // catchError((error) => {
        //   throw new HttpException(
        //     error?.response?.data || 'Failed to load document',
        //     error?.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
        //   );
        // }),
        map((res) => res.data),
      );
  }
}
