import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { EdoModule } from '@urgp/server/edo';
import { DatabaseModule } from '@urgp/server/database';
import { GptModule } from '@urgp/server/llm';
import { RsmModule } from '@urgp/server/rsm';
import {
  ExternalAuthModule,
  EdoApiModule,
  RsmApiModule,
} from '@urgp/server/external-auth';
import { RenovationModule } from '@urgp/server/renovation';
import { AuthModule } from '@urgp/server/auth';
import { CacheModule } from '@nestjs/cache-manager';
import { ControlModule } from '@urgp/server/control';
import { DataMosModule } from '@urgp/server/data-mos';
import { AddressModule } from '@urgp/server/address';
import { FiasModule } from '@urgp/server/fias';
import { DaDataModule } from '@urgp/server/dadata';
import { TelegramModule } from '@urgp/server/telegram';

@Module({
  // dot env files
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    // cls module (async local storage custom implementation),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        // setup: (cls, req) => {
        //   cls.set('userId', req.headers['x-user-id']);
        // },
      },
    }),

    EdoModule,
    DatabaseModule,
    GptModule,
    RsmModule,
    ExternalAuthModule,
    EdoApiModule,
    RsmApiModule,
    RenovationModule,
    AuthModule,
    ControlModule,

    DataMosModule,
    DaDataModule,
    FiasModule,
    AddressModule,
    TelegramModule,
  ],
})
export class AppModule {}
