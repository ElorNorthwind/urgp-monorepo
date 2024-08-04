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

  @Get('test')
  testEnv(): string {
    // return process.env['JWT_REFRESH_SECRET'] || 'oops';
    return this.auth.testEnv();
  }
  @Post('signup')
  @UsePipes(new ZodValidationPipe(createUser))
  signup(@Body() dto: CreateUserDto) {
    return this.auth.signUp(dto);
  }

  // @Get('old-buildings')
  // @UsePipes(new ZodValidationPipe(getOldBuldings))
  // getOldBuldings(
  //   @Query() getOldHousesDto: GetOldBuldingsDto,
  // ): Promise<OldBuilding[]> {
  //   return this.renovation.getOldBuildings(getOldHousesDto);
  // }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @UsePipes(new ZodValidationPipe(authUser))
  signin(
    @Req() req: RequestWithLocalAccessData,
    // @Res({ passthrough: true }) response: Response,
  ) {
    // response.cookie('Authorization', `Bearer test`, { domain: 'localhost' });
    return this.auth.signIn(req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: RequestWithAccessToken) {
    this.auth.logout(req.user['sub']);
    return 'ok';
  }

  @UseGuards(AccessTokenGuard)
  @Post('change-password')
  @UsePipes(new ZodValidationPipe(changePassword))
  changePassword(
    @Req() req: RequestWithAccessToken,
    @Body() dto: ChangeUserPasswordDto,
  ) {
    // Это надо вывести в библиотеку CASL
    const id = req.user['sub'];
    const roles = req.user['roles'];
    if (!roles.includes('admin') && id !== dto.id) {
      throw new UnauthorizedException('Unauthorized operation');
    }

    this.auth.changePassword(id, dto.password);
    return 'ok';
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: RequestWithRefreshToken) {
    const id = req.user['sub'];
    const tokenVersion = req.user['tokenVersion'];
    console.log(id, tokenVersion);
    return this.auth.refreshTokens(id, tokenVersion);
  }
}
