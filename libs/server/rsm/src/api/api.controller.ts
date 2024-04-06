import { Controller, Get } from '@nestjs/common';
import { RsmAuthService } from './auth.service';
import { Observable } from 'rxjs';

@Controller('rsm/api')
export class RsmApiController {
  constructor(private readonly auth: RsmAuthService) {}

  @Get('token') // только для теста
  getToken(): Promise<string> {
    return this.auth.getRsmAuthToken(
      process.env['RSM_LOGIN'] || '',
      process.env['RSM_PASSWORD'] || '',
    );
  }
}
