import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@urgp/server/pipes';
import { UsersService } from './users.service';
import { User } from '@urgp/shared/entities';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('')
  GetAllUsers(): Promise<User[]> {
    return this.users.getAll();
  }
}
