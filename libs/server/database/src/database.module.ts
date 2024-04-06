import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

// @Module({
//     imports: [EdoApiModule],
//     controllers: [EdoDocumentsController],
//     providers: [EdoDocumentsService, EdoHtmlService],
//   })
//   export class EdoDocumentsModule {}
