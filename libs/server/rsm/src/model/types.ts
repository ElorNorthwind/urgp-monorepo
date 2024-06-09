export type RsmSearchParams = {
  registerId: string;
  layoutId: number;
  query: RsmSearchQuery;
};

export type RsmSearchQuery = {
  searchData?: Record<string, string>;
  dynamicControlData?: {
    validHouse?: boolean; // основной адрес + хотя бы одно жилоке помещение
    buildingNum?: string; // дом
    housingNum?: string; // корпус
    structureNum?: string; // строение
    unom?: number[] | number; // 45100200
    btiUnom?: number[] | number; // 43704800
    cadastrNum?: string[] | string; // 45002800
    signDate?: { from: string; to: string }; // "2023-01-01T00:00:00"
  };
  searchDataNewDesign?: {
    houseCadastrNum?: string;
    subjectTypeOther?: boolean;
  };
  transitionQuery?: {
    unom?: number;
  };
};

export type RsmSearchResult = {
  data: unknown[];
  count: number;
  error?: unknown;
};

export type HouseSerachQuery = {
  street: string;
  buildingNum?: string; // дом
  housingNum?: string; // корпус
  structureNum?: string; // строение
};
