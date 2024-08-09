import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  AuthUserDto,
  CreateUserDto,
  User,
  UserWithCredentials,
} from '@urgp/shared/entities';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Response } from 'express';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false, // we don't have https :(
  maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  domain: process.env['DOMAIN'] || '',
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly dbServise: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService, // why tho?
  ) {}
  public testEnv(): string {
    return this.configService.get<string>('DOMAIN') || 'env file not found :(';
  }

  public async validateUser(dto: AuthUserDto): Promise<User> {
    const user: UserWithCredentials =
      await this.dbServise.db.renovationUsers.getByLogin({
        login: dto.login.toLowerCase(),
      });
    if (!user)
      throw new BadRequestException(
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'Неверный логин или пароль'
          : 'Пользователь не существует',
      );

    const { password, ...result } = user;
    const passwordMatches = await argon2.verify(password, dto.password);
    if (!passwordMatches)
      throw new BadRequestException(
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'Неверный логин или пароль'
          : 'Неверный пароль',
      );

    return result;
  }

  public async signUp(res: Response, dto: CreateUserDto): Promise<void> {
    // Check if user exists
    const userExists = await this.dbServise.db.renovationUsers.getByLogin({
      login: dto.login.toLowerCase(),
    });
    if (userExists) {
      throw new UnauthorizedException(
        'Пользователь с таким логином уже существует',
      );
    }

    // Hash password
    const hash = await this.hashData(dto.password);
    const newUser: UserWithCredentials =
      await this.dbServise.db.renovationUsers.create({
        ...dto,
        login: dto.login.toLowerCase(),
        password: hash,
      });
    await this.setAuthCookies(res, newUser);
  }

  public async logoutAllDevices(userId: number) {
    return await this.dbServise.db.renovationUsers.incrementTokenVersion(
      userId,
    );
  }
  private hashData(data: string) {
    return argon2.hash(data);
  }

  private async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          fio: user.fio,
          roles: user.roles,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          tokenVersion: user.tokenVersion,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async setAuthCookies(res: Response, user: User) {
    const { accessToken, refreshToken } = await this.getTokens(user);
    res.cookie('id', accessToken, cookieOptions);
    res.cookie('rid', refreshToken, cookieOptions);
  }

  public async clearAuthCookies(res: Response) {
    res.clearCookie('id', cookieOptions);
    res.clearCookie('rid', cookieOptions);
  }

  public async resetPassword(id: number, password: string) {
    const hash = await this.hashData(password);
    this.dbServise.db.renovationUsers.changePassword(id, hash);
    this.logoutAllDevices(id);
  }

  public async changePassword(
    id: number,
    oldPassword: string,
    password: string,
  ) {
    const user = await this.dbServise.db.renovationUsers.getById({ id });
    const passwordMatches = await argon2.verify(user.password, oldPassword);
    if (!passwordMatches) throw new ForbiddenException('Неверный пароль');

    this.resetPassword(id, password);
    const hash = await this.hashData(password);
    this.dbServise.db.renovationUsers.changePassword(id, hash);
    this.logoutAllDevices(id);
  }
}
