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
  GetOldAppartmentsDto,
  GetOldBuldingsDto,
  User,
  UserTokens,
  UserWithCredentials,
} from '@urgp/shared/entities';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbServise: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService, // why tho?
  ) {}
  public testEnv(): string {
    return (
      this.configService.get<string>('TEST_ENV') || 'env file not found :('
    );
  }
  async validateUser(dto: AuthUserDto): Promise<User> {
    const user: UserWithCredentials =
      await this.dbServise.db.renovationUsers.getByLogin({
        login: dto.login,
      });
    if (!user)
      throw new BadRequestException(
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'Invalid login or password'
          : 'User does not exist',
      );

    const { password, ...result } = user;
    const passwordMatches = await argon2.verify(password, dto.password);
    if (!passwordMatches)
      throw new BadRequestException(
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'Invalid login or password'
          : 'Wrong password',
      );

    return result;
  }

  async signUp(dto: CreateUserDto): Promise<UserTokens> {
    // Check if user exists
    const userExists = await this.dbServise.db.renovationUsers.getByLogin({
      login: dto.login,
    });
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(dto.password);
    const newUser: UserWithCredentials =
      await this.dbServise.db.renovationUsers.create({
        ...dto,
        password: hash,
      });
    const tokens = await this.getTokens(newUser);
    return tokens;
  }

  async signIn(user: User) {
    // const user = await this.validateUser(dto);
    const tokens = await this.getTokens(user);
    return tokens;
  }

  async logout(userId: number) {
    return await this.dbServise.db.renovationUsers.incrementTokenVersion(
      userId,
    );
  }
  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
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
          sub: user.id,
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

  async refreshTokens(id: number, tokenVersion: number) {
    const user: User = await this.dbServise.db.renovationUsers.getById({ id });
    if (!user || user.tokenVersion !== tokenVersion)
      throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens(user);
    return tokens;
  }
  async changePassword(id: number, password: string) {
    const hash = await this.hashData(password);
    this.dbServise.db.renovationUsers.changePassword(id, hash);
    this.logout(id);
  }
}
