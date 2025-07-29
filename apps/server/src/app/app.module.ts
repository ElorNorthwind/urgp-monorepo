import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AddressModule } from '@urgp/server/address';
import { AuthModule } from '@urgp/server/auth';
import { ControlModule } from '@urgp/server/control';
import { DaDataModule } from '@urgp/server/dadata';
import { DataMosModule } from '@urgp/server/data-mos';
import { DatabaseModule } from '@urgp/server/database';
import { EdoModule } from '@urgp/server/edo';
import { EquityModule } from '@urgp/server/equity';
import {
  EdoApiModule,
  ExternalAuthModule,
  RsmApiModule,
} from '@urgp/server/external-auth';
import { FiasModule } from '@urgp/server/fias';
import { GptModule } from '@urgp/server/llm';
import { QmsModule } from '@urgp/server/qms';
import { RenovationModule } from '@urgp/server/renovation';
import { RsmModule } from '@urgp/server/rsm';
import { SudirModule } from '@urgp/server/sudir';
import { TelegramModule } from '@urgp/server/telegram';
import { ClsModule } from 'nestjs-cls';

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
    ScheduleModule.forRoot(),

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
    EquityModule,

    SudirModule,
    QmsModule,
  ],
})
export class AppModule {}
