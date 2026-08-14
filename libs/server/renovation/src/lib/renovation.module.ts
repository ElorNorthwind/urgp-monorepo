import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { RenovationController } from './renovation.controller';
import { RenovationService } from './renovation.service';
import { DsaDgiModule } from '@urgp/server/dsa-dgi';
import { RenovationSyncService } from './renovation-sync.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DsaDgiModule,
    DatabaseModule,
    HttpModule.register({
      baseURL: 'http://10.9.96.160:5153/v1/auth/external',
    }),
  ],
  providers: [RenovationService, RenovationSyncService],
  controllers: [RenovationController],
})
export class RenovationModule {}
