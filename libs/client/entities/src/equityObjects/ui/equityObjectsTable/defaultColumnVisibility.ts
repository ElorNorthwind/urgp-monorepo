import { VisibilityState } from '@tanstack/react-table';
import { equityObjectsColumns } from './equityObjectsColumns';

const defaultEquityObjectsHiddenColumns: string[] = ['rgProgress'];

export const defaultEquityObjectsColumns: VisibilityState = {
  ...equityObjectsColumns
    .filter((col) => col.enableHiding !== false)
    .reduce((acc, cur) => {
      return cur.id
        ? {
            ...acc,
            [cur.id]: defaultEquityObjectsHiddenColumns.includes(cur.id)
              ? false
              : true,
          }
        : acc;
    }, {}),
};
