import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@urgp/server/pipes';
import { AuthService } from './auth.service';
import {
  AuthUserDto,
  CreateUserDto,
  RequestWithAccessToken,
  RequestWithRefreshToken,
  User,
  UserAccessTokenInfo,
  UserRefreshTokenInfo,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

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

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: RequestWithAccessToken) {
    this.auth.logout(req.user['sub']);
    return 'ok';
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: RequestWithRefreshToken) {
    const id = req.user['sub'];
    const tokenVersion = req.user['tokenVersion'];
    return this.auth.refreshTokens(id, tokenVersion);
  }
}