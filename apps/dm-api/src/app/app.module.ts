import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '@urgp/server/auth';
import { DgiAnalyticsModule } from '@urgp/server/dgi-analytics';
import { DmModule } from '@urgp/server/dm';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ScheduleModule.forRoot(),

    AuthModule,
    DgiAnalyticsModule,
    DmModule,
  ],
})
export class AppModule {}
