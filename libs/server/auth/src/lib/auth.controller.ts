import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@urgp/server/pipes';
import { AuthService } from './auth.service';
import {
  authUser,
  AuthUserDto,
  changePassword,
  ChangeUserPasswordDto,
  createUser,
  CreateUserDto,
  RequestWithAccessToken,
  RequestWithLocalAccessData,
  RequestWithRefreshToken,
  User,
  UserAccessTokenInfo,
  UserRefreshTokenInfo,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { LocalAuthGuard } from './guards/localAuth.guart';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Get('test')
  testEnv(): string {
    return this.auth.testEnv();
  }

  @Post('signup')
  @UsePipes(new ZodValidationPipe(createUser))
  signup(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.auth.signUp(res, dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(new ZodValidationPipe(authUser))
  async signin(
    @Req() req: RequestWithLocalAccessData,
    @Res({ passthrough: true }) res: Response,
  ) {
    // response.cookie('Authorization', `Bearer test`, { domain: 'localhost' });
    await this.auth.setAuthCookies(res, req.user);
    return 'login as ' + req.user.login;
  }

  @Get('logout')
  logout(
    @Req() req: RequestWithAccessToken,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.auth.clearAuthCookies(res);
    return 'loged out on this device';
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout-all-devices')
  logoutAllDevices(
    @Req() req: RequestWithAccessToken,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.auth.logoutAllDevices(req.user.sub);
    this.auth.clearAuthCookies(res);
    return 'loged out on all devices';
  }

  @UseGuards(AccessTokenGuard)
  @Post('change-password')
  @UsePipes(new ZodValidationPipe(changePassword))
  changePassword(
    @Req() req: RequestWithAccessToken,
    @Body() dto: ChangeUserPasswordDto,
  ) {
    // Это надо вывести в отдельный гвард через библиотеку CASL
    const id = req.user['sub'];
    const roles = req.user['roles'];
    if (!roles.includes('admin') && id !== dto.id) {
      throw new UnauthorizedException('Unauthorized operation');
    }

    this.auth.changePassword(id, dto.password);
    // return 'ok';
    return req.user.login + ' password changed to ' + dto.password;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: RequestWithRefreshToken,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.setAuthCookies(res, req.user);
    return (
      'tokens refreshed until ' +
      new Date(req.user.exp * 1000).toLocaleString('ru-RU')
    );
  }
}
