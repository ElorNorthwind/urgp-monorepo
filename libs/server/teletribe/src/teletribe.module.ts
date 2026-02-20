import { Module } from '@nestjs/common';
import { DgiAnalyticsModule } from '@urgp/server/dgi-analytics';
import { DatabaseModule } from '@urgp/server/database';
import { HttpModule } from '@nestjs/axios';
import { TeletribeService } from './teletribe.service';
import { TeletribeController } from './teletribe.controller';
import { EmailModule } from '@urgp/server/email';
import { TELETRIBE_HTTP_OPTIONS } from './config/constants';

@Module({
  imports: [
    EmailModule,
    DatabaseModule,
    DgiAnalyticsModule,
    HttpModule.register(TELETRIBE_HTTP_OPTIONS),
  ],
  controllers: [TeletribeController],
  providers: [TeletribeService],
})
export class TeletribeModule {}
