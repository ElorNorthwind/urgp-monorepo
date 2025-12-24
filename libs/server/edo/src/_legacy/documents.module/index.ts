import { Module } from '@nestjs/common';
import { EdoDocumentsController } from './documents.controller';
import { EdoDocumentsService } from './documents.service';
import { EdoApiModule } from '../api.module';
import { EdoHtmlService } from './html.service';
import { EdoResolutionsService } from './resolutions.service';

@Module({
  imports: [EdoApiModule],
  controllers: [EdoDocumentsController],
  providers: [EdoDocumentsService, EdoResolutionsService, EdoHtmlService],
  exports: [EdoDocumentsService, EdoResolutionsService, EdoHtmlService],
})
export class EdoDocumentsModule {}

// ДГИ-ЭГР-49950/23 - два вопроса в карточке, оба на ДГИ
// ДГИ-ЭГР-49932/23 - три вопроса в кароточке, на ДГИ только 2
// ДГИ-ЭГР-47029/23 - есть пометка изменённого срока, без замены самой резолюции
// ДГИ-1-52354/23 - резолюция отменялась, создана взамен разосланной
// ДГИ-ГР-18454/23 - блок "сопроводительное письмо"
