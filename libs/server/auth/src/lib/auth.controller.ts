import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@urgp/server/pipes';
import { AuthService } from './auth.service';
import { User } from '@urgp/shared/entities';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('')
  GetAllUsers(): Promise<User[]> {
    return this.auth.getAll();
  }
}
