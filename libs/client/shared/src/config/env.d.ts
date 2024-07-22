/// <reference types="vite/client" />

import '@tanstack/react-table';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // more env variables...
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
