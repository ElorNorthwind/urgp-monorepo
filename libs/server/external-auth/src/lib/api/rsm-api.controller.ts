import { Controller, Get } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { RsmHttpService } from './rsm-http-service';

@Controller('ext/auth/rsm')
export class RsmTestController {
  constructor(private readonly rsm: RsmHttpService) {}

  @Get('doc-test')
  getEdoTestDoc(): Observable<string> {
    const freeSpaceId = 3404188;

    return this.rsm
      .request<string>({
        method: 'get',
        url: '/CityObjectPremise/RoomsGridRead',
        params: {
          freeSpaceId,
          // x_external_auth: { lookup: { system: 'RSM', userId: 10 } },
        },
      })
      .pipe(map((res) => res.data));
  }
}
