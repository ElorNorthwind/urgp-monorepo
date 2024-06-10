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

@Module({
  // dot env files
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      isGlobal: true,
    }),
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
  ],
})
export class AppModule {}
