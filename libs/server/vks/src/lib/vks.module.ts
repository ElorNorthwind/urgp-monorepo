import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { VksController } from './vks.controller';

import { HttpModule } from '@nestjs/axios';
import { VksService } from './vks.service';
import * as https from 'https'; // Import https module

@Module({
  imports: [
    DatabaseModule,
    HttpModule.register({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        keepAlive: true,
      }),
    }),
  ],
  providers: [VksService],
  controllers: [VksController],
  exports: [VksService],
})
export class VksModule {}
