export type User = {
  id: number;
  login: string;
  fio: string;
  roles: string[];
  tokenVersion: number;
};

export type UserWithCredentials = User & {
  password: string;
};

export type UserTokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserAccessTokenInfo = {
  sub: number;
  login: string;
  roles: string[];
  iat: number;
  exp: number;
};
export type UserRefreshTokenInfo = {
  sub: number;
  tokenVersion: number;
  iat: number;
  exp: number;
};

export type RequestWithUserData = Request & {
  user: User;
};

// export type RequestWithAccessToken = Request & {
//   user: UserAccessTokenInfo;
// };
// export type RequestWithRefreshToken = Request & {
//   user: User & { exp: number }; // we get the full user info from bd
// };

// {
//   sub: user.id,
//   login: user.login,
//   roles: user.roles,
// },
// {
//   secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
//   expiresIn: '15m',
// },
// ),
// this.jwtService.signAsync(
// {
//   sub: user.id,
//   tokenVersion: user.tokenVersion,
// },

//  id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
//  login character varying(225) NOT NULL UNIQUE,
//  fio character varying(225),
//  password varchar NOT NULL,
//  salt varchar NOT NULL DEFAULT 'some_salt',
//  refreshTokenVersion integer DEFAULT 1,
//  roles varchar[] DEFAULT array['user']::varchar[],
