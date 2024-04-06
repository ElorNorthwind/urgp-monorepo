import { EdoDocumentOgFields } from '../../../model/types/edo-document';
import { OgData } from '../../types/og-data';

export function getOgFields(ogData: OgData | undefined): EdoDocumentOgFields {
  if (!ogData) return {};
  const questions =
    ogData.questions
      ?.map((question) => ({
        id: question.id,
        n: question.n,
        annotation: question?.annotation || undefined,
        category: question?.category || undefined,
        theme_id: question?.theme_id || undefined,
        kind_ref_id: question?.kind_ref_id || undefined,
        type_replication: question?.type_replication || undefined,
        theme_path: question?.theme_path || undefined,
        theme_name: question?.theme_name || undefined,
        kind_name: question?.kind_name || undefined,
        type_replication_name: question?.type_replication_name || undefined,
      }))
      ?.filter((q) => !!q?.id) || [];

  const authors =
    ogData.authors
      ?.map((author) => ({
        id: author.id,
        n: author.n,
        fio: author?.ln || undefined,
        country_name: author?.country_name || undefined,
        republic_name: author?.republic_name || undefined,
        republic_area_name: author?.republic_area_name || undefined,
        city_name: author?.city_name || undefined,
        adistrict_name: author?.adistrict_name || undefined,
        district_name: author?.district_name || undefined,
        street: author?.street || undefined,
        house: author?.house || undefined,
        building: author?.building || undefined,
        apartment: author?.apartment || undefined,
        zip: author?.zip || undefined,
        phone: author?.phone || undefined,
        email: author?.email || undefined,
      }))
      ?.filter((a) => !!a?.id) || [];

  return {
    questions,
    authors,
  };
}
