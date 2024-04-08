import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import parse from 'node-html-parser';
import { Observable, from, map } from 'rxjs';
import { EDO_HTTP_OPTIONS } from '../config/request-config';

@Injectable()
export class ExternalAuthService {
  constructor(private readonly httpService: HttpService) {}

  getDnsid(): Observable<string> {
    return from(
      this.httpService.get('/auth.php', EDO_HTTP_OPTIONS).pipe(
        map((res) => {
          const dnsid = parse(res.data)
            .querySelector("input[name='DNSID']")
            ?.getAttribute('value');
          if (!dnsid)
            throw new HttpException(
              "Couldn't get DNISD",
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          return dnsid;
        }),
      ),
    );
  }
}
