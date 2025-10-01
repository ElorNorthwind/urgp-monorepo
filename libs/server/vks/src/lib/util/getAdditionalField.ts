import { Logger } from '@nestjs/common';

export const booringReportAdditionalFields = {
  problemAudio: String.raw`ВКС\.\sТехнические\sтрудности\sво\sвремя\sконсультации\.\sАудио`,
  problemVideo: String.raw`ВКС\.\sТехнические\sтрудности\sво\sвремя\sконсультации\.\sВидео`,
  problemConnection: String.raw`ВКС\.\sТехнические\sтрудности\sво\sвремя\sконсультации.\sИнтернет`,
  problemTech: String.raw`ВКС\.\sТехнические\sтрудности\sво\sвремя\sконсультации`,
  vksSearchSpeed: String.raw`ВКС\.\s?Оценка\sбыстроты\sпоиска\sсервиса`,
  onlineGrade: String.raw`Онлайн\-консультация\.\sОценка`,
  onlineGradeComment: String.raw`Онлайн\-консультация\.\sКомментарий\sк\sоценке`,
  operatorLink: String.raw`Ссылка\sоператора`,
  participantFio: String.raw`ФИО\sучастника`,
  problemSummary: String.raw`(?:Краткое\sсодержание(?:\sвопроса\sзаявителя)?|Суть\sвопроса)`,
  address: String.raw`Адрес\sобъекта\sприватизации`,
  contractNumber: String.raw`Номер\sдоговора`,
  letterNumber: String.raw`Номер\sобращения\sв\sДГИ`,
  flsNumber: String.raw`Номер\sфинансово\-лицевого\sсчета`,
};
export function getAdditionalField(
  rawText: string,
  field: keyof typeof booringReportAdditionalFields,
): string {
  const re = new RegExp(
    String.raw`${booringReportAdditionalFields[field]} : (.*?)(?:\n(?:ВКС\.|Онлайн\-консультация\.|Ссылка\sоператора|ФИО\sучастника|Краткое\sсодержание|Суть\sвопроса|Номер\s(?:договора|обращения|финансового\-лицевого)|Адрес\sобъекта)|$)`,
    'g',
  );
  return re.exec(rawText)?.[1] ?? '-';
}
