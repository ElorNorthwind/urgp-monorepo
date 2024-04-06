import { EdoDocumentFilesField } from '../../../model/types/edo-document';
import { EdoFileData } from '../../types/file-data';

export function getFileFields(
  fileList: EdoFileData | undefined,
): EdoDocumentFilesField {
  if (!fileList || fileList.length === 0) return {};

  const files = fileList.map((edoFile) => ({
    id: edoFile.id,
    name: edoFile.name || undefined,
    filesize: edoFile.filesize || undefined,
  }));

  return {
    files,
  };
}
