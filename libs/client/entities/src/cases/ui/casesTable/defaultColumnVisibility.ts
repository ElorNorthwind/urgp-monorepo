import { VisibilityState } from '@tanstack/react-table';
import { incidentsTableColumns } from './incidentsTableColumns';

const defaultIncidentHiddenColumns = ['viewStatus', 'smartApprove', 'stage'];
const defaultPendingHiddenColumns = ['viewStatus', 'externalCases', 'type'];
export const defaultIncidentColumns: VisibilityState = {
  ...incidentsTableColumns
    .filter((col) => col.enableHiding !== false)
    .reduce((acc, cur) => {
      return cur.id
        ? {
            ...acc,
            [cur.id]: defaultIncidentHiddenColumns.includes(cur.id)
              ? false
              : true,
          }
        : acc;
    }, {}),
};
export const defaultPendingColumns: VisibilityState = {
  ...incidentsTableColumns
    .filter((col) => col.enableHiding !== false)
    .reduce((acc, cur) => {
      return cur.id
        ? {
            ...acc,
            [cur.id]: defaultPendingHiddenColumns.includes(cur.id)
              ? false
              : true,
          }
        : acc;
    }, {}),
};
