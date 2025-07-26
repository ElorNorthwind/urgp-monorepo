import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { SudirController } from './sudir.controller';
import { SudirService } from './sudir.service';

@Module({
  imports: [DatabaseModule],
  providers: [SudirService],
  controllers: [SudirController],
})
export class SudirModule {}
