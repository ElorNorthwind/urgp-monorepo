import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UsersModule } from '@urgp/server/users';

@Module({
  imports: [JwtModule.register({}), UsersModule, DatabaseModule],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

// @Module({
//   imports: [DatabaseModule],
//   providers: [RenovationService],
//   controllers: [RenovationController],
// })
// export class RenovationModule {}
