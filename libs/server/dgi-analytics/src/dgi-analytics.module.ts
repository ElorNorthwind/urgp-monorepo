import { Module } from '@nestjs/common';
import { DgiAnalyticsService } from './dgi-analytics.service';

@Module({
  controllers: [],
  providers: [DgiAnalyticsService],
  exports: [DgiAnalyticsService],
})
export class DgiAnalyticsModule {}

// @Module({
//     imports: [EdoApiModule],
//     controllers: [EdoDocumentsController],
//     providers: [EdoDocumentsService, EdoHtmlService],
//   })
//   export class EdoDocumentsModule {}
