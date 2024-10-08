import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserRefreshTokenInfo } from '@urgp/shared/entities';
import { DatabaseService } from '@urgp/server/database';

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['rid'];
  }
  return token;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly dbServise: DatabaseService) {
    super({
      jwtFromRequest: cookieExtractor, //ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env['JWT_REFRESH_SECRET'] || 'super-secret-refresh-secret',
      // passReqToCallback: true,
    });
  }

  async validate(payload: UserRefreshTokenInfo) {
    const user: User = await this.dbServise.db.renovationUsers.getById({
      id: payload.id,
    });
    if (!user || user.tokenVersion !== payload.tokenVersion)
      throw new UnauthorizedException('Access Denied');
    return { ...user, password: undefined }; // { ...user, exp: payload.exp };
  }
}
