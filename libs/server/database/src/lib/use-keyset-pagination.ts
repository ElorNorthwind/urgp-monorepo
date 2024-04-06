interface paginationProp {
  name: string;
  value?: any;
  minValue?: any;
}

type keysetPaginationReturnVaues = [string, Record<string, any>];

export function useKeysetPagination(
  columns: paginationProp[],
  comparitor: '>' | '<' = '>',
  alias?: string,
): keysetPaginationReturnVaues {
  const prefix = alias ? alias + '.' : '';

  const valuesObj: Record<string, any> = {};
  const columnsArr: string[] = [];
  const valuesArr: string[] = [];
  const orderArr: string[] = [];

  columns.forEach((col) => {
    // добавляем все поля в сортировку
    orderArr.push(`${prefix}"${col.name}"`);

    // в выборку добавляем только те поля, где есть value
    if (col.value == null) return;
    valuesArr.push('${' + col.name.toLowerCase() + '}');

    valuesObj[col.name.toLowerCase()] = col.value;
    const prefixedColumn = `${prefix}"${col.name}"`;

    if (col.minValue != null) {
      valuesObj['min' + col.name.toLowerCase()] = col.minValue;
      columnsArr.push(
        'COALESCE(' +
          prefixedColumn +
          ', ${min' +
          col.name.toLowerCase() +
          '})',
      );
    } else {
      columnsArr.push(prefixedColumn);
    }
  });

  const cols = columnsArr.join(', ');
  const vals = valuesArr.join(', ');
  const ord = orderArr.join(', ');

  const filterSql =
    valuesArr.length > 0 ? `AND (${cols}) ${comparitor} (${vals})` : ``;

  return [`${filterSql} ORDER BY ${ord}`, valuesObj];
}
