import { Module } from '@nestjs/common';
import { EdoDocumentsModule } from './documents.module';
import { EdoApiModule } from './api.module';

@Module({
  imports: [EdoDocumentsModule, EdoApiModule],
  exports: [EdoDocumentsModule],
})
export class EdoModule {}
