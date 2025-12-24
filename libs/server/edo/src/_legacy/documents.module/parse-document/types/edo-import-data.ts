import { type HTMLElement } from 'node-html-parser';
import { OgData } from './og-data';
import { ResolutionData } from './resolution-actors-data';
import { EdoFileData } from './file-data';

type EdoDocumentHtmlData = {
  card: HTMLElement;
  agreetable?: HTMLElement;
  resolutions?: HTMLElement;
};

type EdoDocumentScriptData = {
  documentId: string;
  documentOg?: OgData;
  whomResolutionsSent?: ResolutionData;
  fileList?: EdoFileData;
};

export type EdoImportData = EdoDocumentScriptData & EdoDocumentHtmlData;
