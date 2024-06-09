import { Module } from '@nestjs/common';
import { RsmApiModule } from '@urgp/server/external-auth';
import { RsmSearchService } from './search.service';
import { RsmBtriService } from './bti.service';
import { RsmController } from './rsm.controller';

@Module({
  imports: [RsmApiModule],
  providers: [RsmSearchService, RsmBtriService],
  controllers: [RsmController],
})
export class RsmModule {}
