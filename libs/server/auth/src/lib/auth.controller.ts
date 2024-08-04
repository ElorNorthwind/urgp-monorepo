import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@urgp/server/pipes';
import { AuthService } from './auth.service';
import { AuthUserDto, CreateUserDto, User } from '@urgp/shared/entities';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('test')
  testEnv(): string {
    // return process.env['JWT_REFRESH_SECRET'] || 'oops';
    return this.auth.testEnv();
  }

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.auth.signUp(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthUserDto) {
    return this.auth.signIn(dto);
  }

  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.auth.logout(req.user['sub']);
  // }
}
