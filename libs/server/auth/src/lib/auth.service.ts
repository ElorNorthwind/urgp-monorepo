import { BadRequestException, Injectable } from '@nestjs/common';
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
    private usersService: UsersService,
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
    const userExists = await this.dbServise.db.renovationUsers.getUserByLogin({
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
    // await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(dto: AuthUserDto) {
    // Check if user exists
    const user: UserWithCredentials =
      await this.dbServise.db.renovationUsers.getUserByLogin({
        login: dto.login,
      });

    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, dto.password);

    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user);
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
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

  // async updateRefreshToken(userId: string, refreshToken: string) {
  //   const hashedRefreshToken = await this.hashData(refreshToken);
  //   await this.usersService.update(userId, {
  //     refreshToken: hashedRefreshToken,
  //   });
  // }

  async getTokens(user: UserWithCredentials) {
    // const { login, roles, tokenVersion } =
    //   await this.dbServise.db.renovationUsers.getUserById({ id });

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
}

// import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateUserDto } from 'src/users/dto/create-user.dto';
// import { UsersService } from 'src/users/users.service';
// import * as argon2 from 'argon2';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { AuthDto } from './dto/auth.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//     private configService: ConfigService,
//   ) {}
//   async signUp(createUserDto: CreateUserDto): Promise<any> {
//     // Check if user exists
//     const userExists = await this.usersService.findByUsername(
//       createUserDto.username,
//     );
//     if (userExists) {
//       throw new BadRequestException('User already exists');
//     }

//     // Hash password
//     const hash = await this.hashData(createUserDto.password);
//     const newUser = await this.usersService.create({
//       ...createUserDto,
//       password: hash,
//     });
//     const tokens = await this.getTokens(newUser._id, newUser.username);
//     await this.updateRefreshToken(newUser._id, tokens.refreshToken);
//     return tokens;
//   }

// 	async signIn(data: AuthDto) {
//     // Check if user exists
//     const user = await this.usersService.findByUsername(data.username);
//     if (!user) throw new BadRequestException('User does not exist');
//     const passwordMatches = await argon2.verify(user.password, data.password);
//     if (!passwordMatches)
//       throw new BadRequestException('Password is incorrect');
//     const tokens = await this.getTokens(user._id, user.username);
//     await this.updateRefreshToken(user._id, tokens.refreshToken);
//     return tokens;
//   }

// 	async logout(userId: string) {
//     return this.usersService.update(userId, { refreshToken: null });
//   }

//   hashData(data: string) {
//     return argon2.hash(data);
//   }

//   async updateRefreshToken(userId: string, refreshToken: string) {
//     const hashedRefreshToken = await this.hashData(refreshToken);
//     await this.usersService.update(userId, {
//       refreshToken: hashedRefreshToken,
//     });
//   }

//   async getTokens(userId: string, username: string) {
//     const [accessToken, refreshToken] = await Promise.all([
//       this.jwtService.signAsync(
//         {
//           sub: userId,
//           username,
//         },
//         {
//           secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
//           expiresIn: '15m',
//         },
//       ),
//       this.jwtService.signAsync(
//         {
//           sub: userId,
//           username,
//         },
//         {
//           secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
//           expiresIn: '7d',
//         },
//       ),
//     ]);

//     return {
//       accessToken,
//       refreshToken,
//     };
//   }
// }
