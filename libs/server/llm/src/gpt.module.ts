import { Module } from '@nestjs/common';
import { YandexGptService } from './yandex.service';
import { GigachatService } from './gigachat.service';
import { GptController } from './gpt.controller';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import { GptService } from './gpt.service';
import { DatabaseModule } from '@urgp/server/database';
import { EdoModule } from '@urgp/server/edo';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
@Module({
  imports: [
    HttpModule.register({ httpsAgent: httpsAgent }),
    DatabaseModule,
    EdoModule,
  ],
  providers: [YandexGptService, GigachatService, GptService],
  controllers: [GptController],
})
export class GptModule {}
