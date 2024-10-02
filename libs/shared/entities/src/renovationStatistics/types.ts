export type OkrugTotals = {
  okrug: string;
  total: number;
  done: number;
  inProgress: number;
  notStarted: number;
};

export type OkrugTotalDeviations = {
  okrug: string;
  riskHouses: number;
  attentionHouses: number;
  riskApartments: number;
  attentionApartments: number;
};

export type DoneTimelinePoint = {
  year: number;
  month: number;
  period: string;
  fullPeriod: string;
  fast: number;
  slow: number;
};

export type CityTotalDeviations = {
  done: number;
  none: number;
  risk: number;
  warning: number;
  notStarted: number;
};

export type CityTotalAgeInfo = {
  age: string;
  // done: number;
  risk: number;
  warning: number;
  none: number;
  full: number;
};

export type StartTimelineInfo = {
  year: number;
  month: number;
  label: string;
  started: number;
  planned: number;
};

export type DoneByYearInfo = {
  year: number;
  '0': number;
  '1': number;
  '2': number;
  '5': number;
  '8': number;
};
