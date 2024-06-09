import { RsmSearchQuery } from '../model/types';

export function formatSearchQueryString(query: RsmSearchQuery) {
  const result: {
    searchQuery: Record<string, string | boolean | object>;
    countQuery: Record<string, string | boolean | object>;
  } = {
    searchQuery: {},
    countQuery: {},
  };

  // ==== СТАНДАРТНЫЙ ПОИСК ПО ИНДЕКСИРОВАННЫМ ПАРАМЕТРАМ ====
  if (query?.searchData) {
    Object.keys(query.searchData).forEach(function (key, index) {
      result.searchQuery[`searchData[${index}].key`] = key;
      result.searchQuery[`searchData[${index}].value`] =
        query.searchData?.[key] || '';
    });
    result.countQuery['searchData'] = Object.keys(query.searchData).map(
      (key) => ({
        key,
        value: query.searchData?.[key],
      }),
    );
  }

  // ==== ПОИСК ПО ДИНАМИЧЕСКИМ ПАРАМЕТРАМ ====
  // Единственный из всех сохратяется в строке (стрингифается дважды), так что скобки эскейпятся при переводе в JSON
  if (query?.dynamicControlData) {
    const controlDataArr = [];

    // Обрабатываем UNOM
    if (Array.isArray(query?.dynamicControlData?.unom)) {
      query.dynamicControlData.unom.forEach((element) => {
        controlDataArr.push({
          IdControl: 'Unom',
          StringValue: element,
          ControlType: 'DynamicNumber',
          QueryOperation: 'list',
          IdAttribute: '45100200',
        });
      });
    } else if (typeof query?.dynamicControlData?.unom === 'number') {
      controlDataArr.push({
        IdControl: 'Unom',
        StringValue: query.dynamicControlData.unom,
        ControlType: 'DynamicNumber',
        QueryOperation: 'Equal',
      });
    }

    // Обрабатываем UNOM в площади (БТИ_ЮТОМ)
    if (Array.isArray(query?.dynamicControlData?.btiUnom)) {
      query.dynamicControlData.btiUnom.forEach((element) => {
        controlDataArr.push({
          IdControl: 'BtiUnom',
          StringValue: element,
          ControlType: 'DynamicNumber',
          QueryOperation: 'list',
          IdAttribute: '43704800',
        });
      });
    } else if (typeof query?.dynamicControlData?.btiUnom === 'number') {
      controlDataArr.push({
        IdControl: 'BtiUnom',
        StringValue: query.dynamicControlData.unom,
        ControlType: 'DynamicNumber',
        QueryOperation: 'Equal',
      });
    }

    // Обрабатываем Кадастровый номер
    if (Array.isArray(query?.dynamicControlData?.cadastrNum)) {
      query.dynamicControlData.cadastrNum.forEach((element) => {
        controlDataArr.push({
          IdControl: 'CadastrNum',
          StringValue: element,
          ControlType: 'DynamicNumber',
          QueryOperation: 'list',
          IdAttribute: '45002800',
        });
      });
    } else if (typeof query?.dynamicControlData?.cadastrNum === 'string') {
      controlDataArr.push({
        IdControl: 'CadastrNum',
        StringValue: query.dynamicControlData.cadastrNum,
        ControlType: 'DynamicNumber',
        QueryOperation: 'Equal',
      });
    }

    // Обрабатываем дату
    if (Array.isArray(query?.dynamicControlData?.signDate)) {
      controlDataArr.push({
        IdControl: 'PERSON_SIGN_DATE',
        ControlType: 'DynamicDate',
        IdAttribute: '45001000',
        From: query.dynamicControlData.signDate.from,
        To: query.dynamicControlData.signDate.to,
      });
    }

    // Обрабатываем валидный адрес жилого дома
    if (query?.dynamicControlData?.validHouse) {
      controlDataArr.push(
        {
          typeControl: 'value',
          text: 'Тип адреса (код)',
          type: 'INTEGER',
          value: '26796',
          id: 603305300,
          allowDelete: true,
        },
        {
          typeControl: 'range',
          text: 'Количество жилых помещений: ',
          type: 'INTEGER',
          from: '1',
          to: '',
          id: 603002600,
          allowDelete: true,
        },
      );
    }

    // Обрабатываем номер дома
    if (query?.dynamicControlData?.buildingNum) {
      controlDataArr.push({
        condition: 'BeginFromNonCaseSensitive',
        typeControl: 'value',
        type: 'STRING',
        text: 'Номер дома/владения/участка',
        value: query.dynamicControlData.buildingNum,
        id: 603300700,
        allowDelete: true,
      });
    }

    // Обрабатываем номер корпуса
    if (query?.dynamicControlData?.housingNum) {
      controlDataArr.push({
        condition: 'BeginFromNonCaseSensitive',
        typeControl: 'value',
        type: 'STRING',
        text: 'Номер корпуса',
        value: query.dynamicControlData.housingNum,
        id: 603300900,
        allowDelete: true,
      });
    }

    // Обрабатываем номер строения
    if (query?.dynamicControlData?.structureNum) {
      controlDataArr.push({
        condition: 'BeginFromNonCaseSensitive',
        typeControl: 'value',
        type: 'STRING',
        text: 'Номер строения/сооружения',
        value: query.dynamicControlData.structureNum,
        id: 603301100,
        allowDelete: true,
      });
    }

    // добавляем результат в запросы
    if (controlDataArr.length > 0) {
      result.searchQuery['SearchDynamicControlData'] =
        JSON.stringify(controlDataArr);
      result.countQuery['SearchDynamicControlData'] =
        JSON.stringify(controlDataArr);
    }
  }

  // ==== НАСТРАИВАЕМЫЙ ПОИСК ПО НОВЫМ ПАРАМЕТРАМ ====
  // Не только преобразовывается в строку, но еще и кодируется в URL (фактически дважды)
  if (query?.searchDataNewDesign) {
    const dataNewDesignArr = [];

    // Кадастровый номер здания
    if (query.searchDataNewDesign?.houseCadastrNum) {
      dataNewDesignArr.push({
        condition: 'Equal',
        typeControl: 'value',
        type: 'STRING',
        text: 'Объект: Кадастровый номер здания',
        textValue: 'Равно....',
        value: query.searchDataNewDesign.houseCadastrNum,
        id: 500109300,
        allowDelete: true,
      });
    }

    // Тип субъекта: Физическое лицо, Юридическое лицо
    if (query.searchDataNewDesign?.subjectTypeOther) {
      dataNewDesignArr.push({
        typeControl: 'value',
        type: 'REFERENCE',
        text: 'Субъект: Тип субъекта',
        textValue: 'Физическое лицо, Юридическое лицо',
        value: [1050000, 1050001],
        referenceId: 11000,
        id: 500103200,
        allowDelete: true,
      });
    }

    // добавляем результат в запросы
    if (dataNewDesignArr.length > 0) {
      result.searchQuery['SearchDataNewDesign'] = encodeURIComponent(
        JSON.stringify(dataNewDesignArr),
      );
      result.countQuery['SearchDataNewDesign'] = encodeURIComponent(
        JSON.stringify(dataNewDesignArr),
      );
    }
  }

  // ==== ПОДЗАПРОС С ПРИВЯЗКОЙ К РОДИТЕЛЬСКОМУ ОБЬЕКТУ TRAISITION QUERY ====
  // url-энкодится дважды, т.к. вся строка уходит как единый параметр запроса

  if (query?.transitionQuery) {
    const transitionQueryArr = [];
    if (query.transitionQuery?.unom) {
      transitionQueryArr.push(`603100400=${query.transitionQuery?.unom}`);
    }

    // добавляем результат в запросы
    if (transitionQueryArr.length > 0) {
      result.searchQuery['isTransition'] = true;
      result.searchQuery['transitionQueryString'] = encodeURIComponent(
        `?${transitionQueryArr.join('&')}`,
      );

      result.countQuery['transitionQueryString'] = true;
      result.countQuery['transitionQueryString'] = encodeURIComponent(
        `?${transitionQueryArr.join('&')}`,
      );
    }
  }

  // isTransition=true&transitionQueryString=?603100400=13489

  return result;
}
