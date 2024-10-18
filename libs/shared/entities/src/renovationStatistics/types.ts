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
  '0f': number;
  '1f': number;
  '2f': number;
  '5f': number;
  '8f': number;
};

export type OldBuildingsStartAndFinish = {
  period: string;
  starts: number;
  finishes: number;
};
export type MonthlyProgressData = {
  period: string;
  year?: number;
  month?: number;
  total?: number;
  ltThreeM: number;
  threeToEightM: number;
  eightToTwelveM: number;
  gtTwelveM: number;
  totalF?: number;
  ltThreeMf: number;
  threeToEightMf: number;
  eightToTwelveMf: number;
  gtTwelveMf: number;
};
