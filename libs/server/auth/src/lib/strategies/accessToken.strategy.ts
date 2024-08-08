import {
  ForbiddenException,
  Injectable,
  Next,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserAccessTokenInfo } from '@urgp/shared/entities';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

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

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey:
        process.env['JWT_ACCESS_SECRET'] || 'super-secret-access-secret',
      ignoreExpiration: true,
      // passReqToCallback: true,
    });
  }

  validate(payload: UserAccessTokenInfo) {
    if (payload.exp <= Date.now() / 1000) {
      // console.log('token expired');
      throw new ForbiddenException('Token expired!');
    }
    // console.log(JSON.stringify(payload, null, 2));
    return payload;
  }
}
