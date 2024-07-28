import { QueryFile } from 'pg-promise';
import { join as joinPath } from 'path';

// Helper for linking to external query files:
function sql(file: string) {
  const fullPath = joinPath(__dirname, file); // generating full path;
  return new QueryFile(fullPath, { minify: true });
}

export const renovation = {
  oldBuildings: sql('sql/renovation/oldBuildings.sql'),
  getOldBuldingsGeoJson: sql('sql/renovation/oldBuildingsGeoJson.sql'),
  oldApartments: sql('sql/renovation/oldApartments.sql'),
  okrugTotalHouses: sql('sql/renovation/okrugTotalHouses.sql'),
};
