import { QueryFile } from 'pg-promise';
import { join as joinPath } from 'path';

// Helper for linking to external query files:
function sql(file: string) {
  const fullPath = joinPath(__dirname, file); // generating full path;
  return new QueryFile(fullPath, { minify: true });
}
export const vks = {
  readDepartmentsClassificator: sql(
    'sql/vks/readVksDepartmentsClassificator.sql',
  ),
  readServiceTypesClassificator: sql(
    'sql/vks/readVksServiceTypeClassificator.sql',
  ),
  readStatusClassificator: sql('sql/vks/readVksStatusClassificator.sql'),
  readVksTimeline: sql('sql/vks/readVksTimeline.sql'),
  readVksStatusStats: sql('sql/vks/readVksStatusStats.sql'),
  readVksDepartmentStats: sql('sql/vks/readVksDepartmentStats.sql'),
  readVksServiceStats: sql('sql/vks/readVksServiceStats.sql'),
};
