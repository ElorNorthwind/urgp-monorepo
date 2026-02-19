import { Module } from '@nestjs/common';
import { DgiAnalyticsModule } from '@urgp/server/dgi-analytics';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [DgiAnalyticsModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
