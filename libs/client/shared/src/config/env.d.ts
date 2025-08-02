/// <reference types="vite/client" />

import '@tanstack/react-table';
import { EQUITY_ROUTES } from './controlConstants';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // more env variables...
  XML_BOSS_FAMILY_NAME: string;
  XML_BOSS_FIRST_NAME: string;
  XML_BOSS_PATRONYMIC: string;
  XML_BOSS_EMAIL: string;
  XML_BOSS_PASSPORT_SERIES: string;
  XML_BOSS_PASSPORT_NUMBER: string;
  XML_BOSS_PASSPORT_DATE: string;
  XML_BOSS_PASSPORT_ISSUE_ORGAN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export { ImportMetaEnv, ImportMeta };

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClass?: string;
    cellClass?: string;
  }
}

export type CaseRoutes = (typeof CASE_ROUTES)[number];
export type EquityRoutes = (typeof EQUITY_ROUTES)[number];
export type VksRoutes = (typeof EQUITY_ROUTES)[number];
