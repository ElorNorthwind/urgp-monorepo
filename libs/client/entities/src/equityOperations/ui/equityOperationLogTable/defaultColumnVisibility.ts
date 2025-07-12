import { VisibilityState } from '@tanstack/react-table';
import { equityOperationLogColumns } from './equityOperationLogColumns';

const defaultEquityOperationLogHiddenColumns: string[] = [
  'problem',
  'workStatus',
];

export const defaultEquityOperationLogColumns: VisibilityState = {
  ...equityOperationLogColumns
    .filter((col) => col.enableHiding !== false)
    .reduce((acc, cur) => {
      return cur.id
        ? {
            ...acc,
            [cur.id]: defaultEquityOperationLogHiddenColumns.includes(cur.id)
              ? false
              : true,
          }
        : acc;
    }, {}),
};
