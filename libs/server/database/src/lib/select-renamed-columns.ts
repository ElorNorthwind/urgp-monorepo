import { ColumnSet } from 'pg-promise';

interface ColumnDef {
  name: string;
  prop?: string;
  [otherOptions: string]: unknown;
}

interface SelectRenamedColumnsProps {
  columns: ColumnDef[];
  tableAlias?: string;
}

export function _SelectRenamedColumns(props: SelectRenamedColumnsProps) {
  const { columns, tableAlias } = props;
  const prefix = tableAlias ? '.' + tableAlias : '';
  return columns
    .map((col) => `${prefix}"${col.name}" as "${col.prop || col.name}"`)
    .join(', ');
}

// casesCs: ColumnSet<DbCase>

export function SelectRenamedColumns<T>(
  cs: ColumnSet<T>,
  alias?: string,
  extraColumns?: string[],
) {
  const prefix = alias ? alias + '.' : '';
  const renamedColumns = cs.columns
    .map((col) => `${prefix}"${col.name}" as "${col.prop || col.name}"`)
    .join(', ');
  const extraText =
    extraColumns?.length && extraColumns?.length > 0
      ? ', ' + extraColumns.join(', ')
      : '';
  return `SELECT ${renamedColumns}${extraText} FROM ${cs.table}${
    alias ? ' ' + alias : ''
  }`;
}
