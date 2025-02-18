import { VisibilityState } from '@tanstack/react-table';
import { incidentsTableColumns } from './incidentsTableColumns';
import { problemsTableColumns } from './problemsTableColumns';

const defaultIncidentHiddenColumns = ['viewStatus', 'smartApprove', 'stage'];
const defaultPendingHiddenColumns = ['viewStatus', 'externalCases', 'type'];
const defaultProblemHiddenColumns = ['viewStatus', 'smartApprove'];

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
export const defaultProblemColumns: VisibilityState = {
  ...problemsTableColumns
    .filter((col) => col.enableHiding !== false)
    .reduce((acc, cur) => {
      return cur.id
        ? {
            ...acc,
            [cur.id]: defaultProblemHiddenColumns.includes(cur.id)
              ? false
              : true,
          }
        : acc;
    }, {}),
};
