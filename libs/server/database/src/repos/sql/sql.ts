import { QueryFile } from 'pg-promise';
import { join as joinPath } from 'path';

// Helper for linking to external query files:
function sql(file: string) {
  const fullPath = joinPath(__dirname, file); // generating full path;
  return new QueryFile(fullPath, { minify: true });
}

export const renovation = {
  oldBuildings: sql('sql/renovation/oldBuildings.sql'),
  oldBuildingById: sql('sql/renovation/oldBuildingById.sql'),
  oldBuldingsGeoJson: sql('sql/renovation/oldBuildingsGeoJson.sql'),
  oldApartments: sql('sql/renovation/oldApartmentsList.sql'),
  okrugTotalHouses: sql('sql/renovation/okrugTotalHouses.sql'),
  okrugTotalDeviations: sql('sql/renovation/okrugTotalDeviations.sql'),
  doneTimeline: sql('sql/renovation/doneTimeline.sql'),
  oldApartmentTimeline: sql('sql/renovation/oldApartmentTimeline.sql'),
  oldApartmentDetails: sql('sql/renovation/oldApartmentDetails.sql'),
  messageCreate: sql('sql/renovation/messageCreate.sql'),
  messageApartmentRead: sql('sql/renovation/messageApartmentRead.sql'),
  messageByIdRead: sql('sql/renovation/messageByIdRead.sql'),
  messageUpdate: sql('sql/renovation/messageUpdate.sql'),
  messageDelete: sql('sql/renovation/messageDelete.sql'),
  connectedPlots: sql('sql/renovation/connectedPlots.sql'),
  cityTotalDeviations: sql('sql/renovation/cityTotalDeviations.sql'),
  cityTotalAges: sql('sql/renovation/cityTotalAges.sql'),
  cityStartTimeline: sql('sql/renovation/cityStartTimeline.sql'),
  cityTotalDoneByYear: sql('sql/renovation/cityTotalDoneByYear.sql'),
  lastUpdated: sql('sql/renovation/lastUpdated.sql'),
  unansweredMessages: sql('sql/renovation/unansweredMessages.sql'),
  oldBuildingList: sql('sql/renovation/oldBuildingList.sql'),
  oldBuildingRelocationMap: sql('sql/renovation/oldBuildingRelocationMap.sql'),
  newBuildingRelocationMap: sql('sql/renovation/newBuildingRelocationMap.sql'),
  newBuildingsGeoJson: sql('sql/renovation/newBuildingsGeoJson.sql'),
  newBuildings: sql('sql/renovation/newBuildings.sql'),
  problematicApartments: sql('sql/renovation/problematicApartments.sql'),
  oldBuildingConnections: sql('sql/renovation/oldBuildingConnections.sql'),
  stageApartmentRead: sql('sql/renovation/stageApartmentRead.sql'),
  stageCreate: sql('sql/renovation/stageCreate.sql'),
  stageDelete: sql('sql/renovation/stageDelete.sql'),
  stageUpdate: sql('sql/renovation/stageUpdate.sql'),
  stageApprove: sql('sql/renovation/stageApprove.sql'),
  stageGroups: sql('sql/renovation/stageGroups.sql'),
  stageNeedsApproval: sql('sql/renovation/stageNeedsApproval.sql'),
  pendingStages: sql('sql/renovation/pendingStages.sql'),
  oldBuildingsStartAndFinishMonthly: sql(
    'sql/renovation/oldBuildingsStartAndFinishMonthly.sql',
  ),
  oldBuildingsStartAndFinishYearly: sql(
    'sql/renovation/oldBuildingsStartAndFinishYearly.sql',
  ),
  monthlyProgressTimeline: sql('sql/renovation/monthlyProgressTimeline.sql'),
  monthlyDoneTimeline: sql('sql/renovation/monthlyDoneTimeline.sql'),
  currentYearSankey: sql('sql/renovation/currentYearSankey.sql'),
  currentYearApartmentsSankey: sql(
    'sql/renovation/currentYearApartmentsSankey.sql',
  ),
};

export const users = {
  getByLogin: sql('sql/users/getByLogin.sql'),
  getById: sql('sql/users/getUserById.sql'),
  create: sql('sql/users/create.sql'),
  incrementTokenVersion: sql('sql/users/incrementTokenVersion.sql'),
  changePassword: sql('sql/users/changePassword.sql'),
  getUserControlData: sql('sql/users/getUserControlData.sql'),
};

export const cases = {
  createCase: sql('sql/control/cases/createCase.sql'),
  readCaseById: sql('sql/control/cases/readCaseById.sql'),
  readCases: sql('sql/control/cases/readCases.sql'),
  updateCase: sql('sql/control/cases/updateCase.sql'),
  deleteCase: sql('sql/control/cases/deleteCase.sql'),
  approveCase: sql('sql/control/cases/approveCase.sql'),
};

export const operations = {
  createStage: sql('sql/control/operations/createStage.sql'),
  readOperationById: sql('sql/control/operations/readStageById.sql'),
  updateStage: sql('sql/control/operations/updateStage.sql'),
  approveOperation: sql('sql/control/operations/approveOperation.sql'),
  deleteOperation: sql('sql/control/operations/deleteOperation.sql'),
};

export const classificators = {
  readOperationTypes: sql('sql/control/classificators/readOperationTypes.sql'),
};
