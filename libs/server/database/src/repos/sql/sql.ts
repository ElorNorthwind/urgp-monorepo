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
  getUserControlSettings: sql('sql/users/getUserControlSettings.sql'),
  setUserControlDirections: sql('sql/users/setUserControlDirections.sql'),
  setUserCaseFilter: sql('sql/users/setUserCaseFilter.sql'),
  getUserApproveTo: sql('sql/users/getUserApproveTo.sql'),
  getControlExecutors: sql('sql/users/getControlExecutors.sql'),
  readUserControlTo: sql('sql/users/readUserControlTo.sql'),
  getEscalationTargets: sql('sql/users/getEscalationTargets.sql'),
  getUserApproveToChains: sql('sql/users/getUserApproveToChains.sql'),
};

export const cases = {
  createCase: sql('sql/control/cases/createCase.sql'),
  readFullCase: sql('sql/control/cases/readFullCase.sql'),
  readSlimCase: sql('sql/control/cases/readSlimCase.sql'),
  updateCase: sql('sql/control/cases/updateCase.sql'),
  deleteCase: sql('sql/control/cases/deleteCase.sql'),
  approveCase: sql('sql/control/cases/approveCase.sql'),
  upsertCaseConnections: sql('sql/control/cases/upsertCaseConnections.sql'),
  upsertCaseConnectionsTo: sql('sql/control/cases/upsertCaseConnectionsTo.sql'),
};

export const operations = {
  createOperation: sql('sql/control/operations/createOperation.sql'),
  readFullOperation: sql('sql/control/operations/readFullOperation.sql'),
  readSlimOperation: sql('sql/control/operations/readSlimOperation.sql'),
  readOperationHistory: sql('sql/control/operations/readOperationHistory.sql'),
  updateOperation: sql('sql/control/operations/updateOperation.sql'),
  deleteOperation: sql('sql/control/operations/deleteOperation.sql'),
  markAsDone: sql('sql/control/operations/markAsDone.sql'),
  markAsSeen: sql('sql/control/operations/markAsSeen.sql'),
  markAsWatched: sql('sql/control/operations/markAsWatched.sql'),
  approveOperation: sql('sql/control/operations/approveOperation.sql'),
};

export const classificators = {
  readOperationTypes: sql('sql/control/classificators/readOperationTypes.sql'),
  readOperationTypesFlat: sql(
    'sql/control/classificators/readOperationTypesFlat.sql',
  ),
  readCaseTypes: sql('sql/control/classificators/readCaseTypes.sql'),
  readCaseDireactionTypes: sql(
    'sql/control/classificators/readCaseDirectionTypes.sql',
  ),
  readCaseStatusTypes: sql(
    'sql/control/classificators/readCaseStatusTypes.sql',
  ),
  readDepartmentTypes: sql(
    'sql/control/classificators/readDepartmentTypes.sql',
  ),
  readDirectionSubscribers: sql(
    'sql/control/classificators/readDirectionSubscribers.sql',
  ),
};

export const dataMos = {
  readPaginatedAddresses: sql(
    'sql/address/data-mos/readPaginatedAddresses.sql',
  ),
  upsertAddresses: sql('sql/address/data-mos/upsertAddresses.sql'),
  countUpdated: sql('sql/address/data-mos/countUpdated.sql'),
  countTotal: sql('sql/address/data-mos/countTotal.sql'),
  clearUpdated: sql('sql/address/data-mos/clearUpdated.sql'),
};

export const sessions = {
  deleteSession: sql('sql/address/sessions/deleteSession.sql'),
  deleteSessionsOlderThan: sql(
    'sql/address/sessions/deleteSessionsOlderThan.sql',
  ),
  getSessionById: sql('sql/address/sessions/getSessionById.sql'),
  getSessionsByUserId: sql('sql/address/sessions/getSessionsByUserId.sql'),
  getSessionsQueue: sql('sql/address/sessions/getSessionsQueue.sql'),
};

export const results = {
  getSessionUnfinishedBatch: sql(
    'sql/address/results/getSessionUnfinishedBatch.sql',
  ),
  getFiasDailyUsage: sql('sql/address/results/getFiasDailyUsage.sql'),
  resetSessionErrorsById: sql('sql/address/results/resetSessionErrorsById.sql'),
};
