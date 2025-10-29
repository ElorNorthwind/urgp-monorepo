import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DtwService {
  constructor(
    private readonly axios: HttpService,
    private configService: ConfigService,
  ) {}

  public async DtwLogin() {
    const login = await this.configService.get<string>('DTW_LOGIN');
    const password = await this.configService.get<string>('DTW_PASSWORD');

    // const formData = new FormData();
    // formData.append('login', login || '');
    // formData.append('password', password || '');

    // Logger.log({ login, password });
    // Logger.log(JSON.stringify(formData));

    try {
      const loginData = await firstValueFrom(
        this.axios.request({
          url: '/auth/login',
          method: 'POST',
          data: `boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="login"

${login}
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="password"

${password}
------WebKitFormBoundary7MA4YWxkTrZu0gW--`,

          // POST /app/auth/login HTTP/1.1
          // Host: dtwapi.mos.ru
          // Content-Length: 236
          // Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

          // ------WebKitFormBoundary7MA4YWxkTrZu0gW
          // Content-Disposition: form-data; name="login"

          // reon_prod
          // ------WebKitFormBoundary7MA4YWxkTrZu0gW
          // Content-Disposition: form-data; name="password"

          // j?O5q$6M
          // ------WebKitFormBoundary7MA4YWxkTrZu0gW--

          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
      );
      return loginData;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
}
