import { Module } from '@nestjs/common';
import { GeoDbService } from './geo-db.service';

@Module({
  controllers: [],
  providers: [GeoDbService],
  exports: [GeoDbService],
})
export class GeoDbModule {}

// @Module({
//     imports: [EdoApiModule],
//     controllers: [EdoDocumentsController],
//     providers: [EdoDocumentsService, EdoHtmlService],
//   })
//   export class EdoDocumentsModule {}
