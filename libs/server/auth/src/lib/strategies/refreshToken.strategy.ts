import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { UserRefreshTokenInfo } from '@urgp/shared/entities';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env['JWT_REFRESH_SECRET'] || 'super-secret-refresh-secret',
      // passReqToCallback: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // validate(req: Request, payload: UserRefreshTokenInfo) {
  //   const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
  //   return { ...payload, refreshToken };
  // }
  validate(payload: UserRefreshTokenInfo) {
    return payload;
  }
}
