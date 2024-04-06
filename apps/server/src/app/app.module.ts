import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { EdoModule } from '@urgp/server/edo';
import { DatabaseModule } from '@urgp/server/database';
// import { EdoModule } from './edo/edo.module';
// import { DatabaseModule } from './database.module';
// import { GptModule } from './gpt/gpt.module';
// import { RsmModule } from './rsm/rsm.module';

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
    // GptModule,
    // RsmModule,
  ],
})
export class AppModule {}
