import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserAccessTokenInfo } from '@urgp/shared/entities';
import { ExtractJwt, Strategy } from 'passport-jwt';

// type JwtPayload = {
//   sub: string;
//   login: string;
//   roles: string[];
// };

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env['JWT_ACCESS_SECRET'] || 'super-secret-access-secret',
    });
  }

  validate(payload: UserAccessTokenInfo) {
    return payload;
  }
}
