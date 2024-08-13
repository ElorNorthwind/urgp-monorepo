export type OkrugTotals = {
  okrug: string;
  total: number;
  done: number;
  inProgress: number;
  notStarted: number;
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
