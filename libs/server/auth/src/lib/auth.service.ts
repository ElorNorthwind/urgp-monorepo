import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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
import { UsersService } from '@urgp/server/users';
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

  async signUp(dto: CreateUserDto): Promise<UserTokens> {
    // Check if user exists
    const userExists = await this.dbServise.db.renovationUsers.getByLogin({
      login: dto.login,
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(dto.password);
    const newUser: UserWithCredentials =
      await this.dbServise.db.renovationUsers.create({
        ...dto,
        password: hash,
      });
    console.log(JSON.stringify(newUser));
    const tokens = await this.getTokens(newUser);
    return tokens;
  }

  async signIn(dto: AuthUserDto) {
    // Check if user exists
    const user: UserWithCredentials =
      await this.dbServise.db.renovationUsers.getByLogin({
        login: dto.login,
      });

    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, dto.password);

    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

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

  async getTokens(user: UserWithCredentials) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          login: user.login,
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
    const user: UserWithCredentials =
      await this.dbServise.db.renovationUsers.getById({ id });
    if (!user || user.tokenVersion !== tokenVersion)
      throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user);
    return tokens;
  }
  async changePassword(id: number, password: string) {
    const hash = await this.hashData(password);
    this.dbServise.db.renovationUsers.changePassword(id, hash);
    this.logout(id);
  }
}
