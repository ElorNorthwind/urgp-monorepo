import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  User,
  UserAccessTokenInfo,
  UserWithCredentials,
} from '@urgp/shared/entities';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { z } from 'zod';
import { AuthService } from '../auth.service';
import { DatabaseService } from '@urgp/server/database';

// type JwtPayload = {
//   sub: string;
//   login: string;
//   roles: string[];
// };

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['id'];
  }
  return token;
};

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super({ usernameField: 'email', passReqToCallback: true })
//   }

//   async validate(req: Request, email: string, password: string, headers:Headers): Promise<IUser> {
//     const subdomain = req.headers.host.split(".")[0];
//     const user = await this.authService.validateUser({ email, password ,//** subdomain})
//     if (!user) {
//       throw new UnauthorizedException()
//     }
//     return user
//   }
// }

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly dbServise: DatabaseService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey:
        process.env['JWT_ACCESS_SECRET'] || 'super-secret-access-secret',
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: UserAccessTokenInfo) {
    if (payload.exp <= Date.now() / 1000) {
      // console.log('token expired');
      throw new ForbiddenException('Token expired!');
    }

    let correctPayload = payload;

    const poseUserId =
      (payload.controlData?.roles?.includes('admin') ||
        payload?.roles?.includes('admin')) &&
      z.coerce
        .number()
        .int()
        .nonnegative()
        .optional()
        .safeParse(req?.headers?.['pose-user-id'])?.data;
    // Logger.debug(poseUserId);

    if (poseUserId) {
      await this.dbServise.db.renovationUsers
        .getById({ id: poseUserId })
        .then((poseUser: User) => {
          if (!poseUser) {
            throw new ForbiddenException('PoseUser not found');
          }
          correctPayload = {
            ...poseUser,
            password: undefined,
            tokenVersion: undefined,
            iat: 0,
            exp: 0,
          } as UserAccessTokenInfo;
        });
    }

    // console.log(JSON.stringify(payload, null, 2));
    return correctPayload;
  }

  // validate(payload: UserAccessTokenInfo) {
  //   if (payload.exp <= Date.now() / 1000) {
  //     // console.log('token expired');
  //     throw new ForbiddenException('Token expired!');
  //   }
  //   // console.log(JSON.stringify(payload, null, 2));
  //   return payload;
  // }
}
