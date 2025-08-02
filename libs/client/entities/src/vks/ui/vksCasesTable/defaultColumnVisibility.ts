import { VisibilityState } from '@tanstack/react-table';
import { vksCasesColumns } from './vksCasesColumns';

const defaultVksCasesHiddenColumns: string[] = [];

export const defaultVksCasesColumns: VisibilityState = {
  ...vksCasesColumns
    .filter((col) => col.enableHiding !== false)
    .reduce((acc, cur) => {
      return cur.id
        ? {
            ...acc,
            [cur.id]: defaultVksCasesHiddenColumns.includes(cur.id)
              ? false
              : true,
          }
        : acc;
    }, {}),
};
