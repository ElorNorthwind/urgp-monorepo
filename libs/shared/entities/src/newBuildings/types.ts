import { OldBuilding } from '../oldBuildings/types';

export type RenovationNewBuilding = {
  id: number;
  okrug: string;
  district: string;
  adress: string;

  plotStartAge: string;
  plotStatus: string;
  plotDeviation: string;
  buildingCount: number;

  planPlotStart: string | Date;
  planPlotDone: string | Date;
  actualPlotStart: string | Date;
  actualPlotDone: string | Date;

  oldBuildings: OldBuilding[];
};

export type RenovationNewBuildingStatusTotals = {
  done: number;
  partial: number;
  ok: number;
  risk: number;
  // full: number;
  none: number;
};

export type RenovationNewBuildingDeviationTotals = {
  plotStartAge: string;
  total: number;
  risk: number;
  attention: number;
  ok: number;
};
