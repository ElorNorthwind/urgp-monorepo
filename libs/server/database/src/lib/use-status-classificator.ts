type OperationClassificatorQuery = {
  field: string;
  comperator: 'LIKE' | '=';
  value: string | number;
};

type StatusClassificatorBaseFields<T extends string | number> = {
  status: T;
};

type StatusNullableClassificator = {
  queryType: 'NULL' | 'NOT_NULL';
  column: string;
};

type StatusOperationClassificator = {
  queryType: 'HAS_OPERATION_TYPE';
  param: OperationClassificatorQuery;
};

type StatusArrayClassificator = {
  queryType: 'IN_ARRAY';
  column: string;
  param: string[] | number[];
};

type StatusCustomClassificator = {
  queryType: 'CUSTOM';
  customQuery: string;
};

export type StatusClassificator<T extends string | number> =
  StatusClassificatorBaseFields<T> &
    (
      | StatusNullableClassificator
      | StatusOperationClassificator
      | StatusArrayClassificator
      | StatusCustomClassificator
    );

type useStatusClassificatorVaues = [string, Record<string, any>];

export function useStatusClassificator<T extends string | number>(
  classificators: Array<StatusClassificator<T>>,
  def: T,
): useStatusClassificatorVaues {
  const strings: string[] = [];
  const valuesObj: Record<string, any> = { classificator_def: def };

  classificators.forEach((cls) => {
    const classificatorObjectKey =
      'classificator_' + cls.status.toString().toLowerCase();
    valuesObj[classificatorObjectKey] = cls.status;

    switch (cls.queryType) {
      case 'NULL':
        strings.push(
          `WHEN "${cls.column}" IS NULL THEN $(${classificatorObjectKey})`,
        );
        break;
      case 'NOT_NULL':
        strings.push(
          `WHEN "${cls.column}" IS NOT NULL THEN $(${classificatorObjectKey})`,
        );
        break;
      case 'HAS_OPERATION_TYPE':
        strings.push(
          `WHEN EXISTS (SELECT FROM json_array_elements(operations) agg(elem) WHERE elem ->> '${
            cls.param.field
          }'::text ${cls.param.comperator} $(${
            'classificator_' + cls.status.toString().toLowerCase() + '_value'
          })) THEN $(${classificatorObjectKey})`,
        );
        valuesObj[
          'classificator_' + cls.status.toString().toLowerCase() + '_value'
        ] = cls.param.value;
        break;
      case 'IN_ARRAY':
        const arrayString = cls.param
          .map((parameter, index) => {
            const key =
              'classificator_' +
              cls.status.toString().toLowerCase() +
              '_value_' +
              index;
            valuesObj[key] = parameter;
            return `$(${key})`;
          })
          .join(', ');
        strings.push(
          `WHEN "${cls.column}" = ANY ARRAY([${arrayString}]) THEN $(${classificatorObjectKey})`,
        );
        break;
      case 'CUSTOM':
        strings.push(
          `WHEN ${cls.customQuery} THEN $(${classificatorObjectKey})`,
        );
        break;
    }
  });
  strings.push(`ELSE $(classificator_def)`);
  return [
    strings.join(`
  `),
    valuesObj,
  ];
}

// WHEN "zamDoneDate" IS NOT NULL THEN 'done'
// WHEN "zamDueDate" IS NULL THEN 'recalled'
// WHEN EXISTS (SELECT FROM json_array_elements(operations) agg(elem) WHERE elem ->> 'num'::text LIKE '%ДГИ-%') THEN 'await'
// WHEN EXISTS (SELECT FROM json_array_elements(operations) agg(elem) WHERE elem ->> 'num'::text LIKE '%согл-%') THEN 'sogl'
// WHEN "userId" IS NULL THEN 'assignment'
// ELSE 'in_work'
