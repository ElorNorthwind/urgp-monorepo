import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '@urgp/server/auth';
import { DataMosModule } from '@urgp/server/data-mos';
import { DgiAnalyticsModule } from '@urgp/server/dgi-analytics';
import { DmModule } from '@urgp/server/dm';
import { GeoDbModule } from '@urgp/server/geo-db';
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
    GeoDbModule,
    DataMosModule,
  ],
})
export class AppModule {}
