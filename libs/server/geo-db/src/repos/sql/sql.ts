import { QueryFile } from 'pg-promise';
import { join as joinPath } from 'path';

// Helper for linking to external query files:
function sql(file: string) {
  const fullPath = joinPath(__dirname, file); // generating full path;
  return new QueryFile(fullPath, { minify: true });
}

export const dataMos = {
  readPaginatedAddresses: sql('sql/data-mos/readPaginatedAddresses.sql'),
  upsertAddresses: sql('sql/data-mos/upsertAddresses.sql'),
  upsertTransportStations: sql('sql/data-mos/upsertTransportStations.sql'),
  getTransportStations: sql('sql/data-mos/getTransportStations.sql'),
};
