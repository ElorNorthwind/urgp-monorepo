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
  specialApartments: sql('sql/renovation/specialApartmentsList.sql'),
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
  manualDatesByBuildingId: sql('sql/renovation/manualDatesByBuildingId.sql'),
  apartmentCapstones: sql('sql/renovation/apartmentCapstones.sql'),
  apartmentStageClassificator: sql(
    'sql/renovation/apartmentStageClassificator.sql',
  ),
  insertApartmentDefects: sql('sql/renovation/insertApartmentDefects.sql'),
  apartmentDefects: sql('sql/renovation/apartmentDefects.sql'),
  cityAgeDifficulties: sql('sql/renovation/cityAgeDifficulties.sql'),
  yearlyDoneTimeline: sql('sql/renovation/yearlyDoneTimeline.sql'),
  yearlyProgressTimeline: sql('sql/renovation/yearlyProgressTimeline.sql'),
};

export const users = {
  getByLogin: sql('sql/users/getByLogin.sql'),
  getById: sql('sql/users/getUserById.sql'),
  getByToken: sql('sql/users/getUserByToken.sql'),
  getByTelegramChatId: sql('sql/users/getUserByTelegramChatId.sql'),
  create: sql('sql/users/create.sql'),
  incrementTokenVersion: sql('sql/users/incrementTokenVersion.sql'),
  changePassword: sql('sql/users/changePassword.sql'),
  getUserControlData: sql('sql/users/getUserControlData.sql'),
  getUserControlSettings: sql('sql/users/getUserControlSettings.sql'),
  setUserControlDirections: sql('sql/users/setUserControlDirections.sql'),
  setUserNotificationsData: sql('sql/users/setUserNotificationsData.sql'),
  setUserCaseFilter: sql('sql/users/setUserCaseFilter.sql'),
  getUserApproveTo: sql('sql/users/getUserApproveTo.sql'),
  getControlExecutors: sql('sql/users/getControlExecutors.sql'),
  readUserControlTo: sql('sql/users/readUserControlTo.sql'),
  getEscalationTargets: sql('sql/users/getEscalationTargets.sql'),
  getUserApproveToChains: sql('sql/users/getUserApproveToChains.sql'),
  getSubscribers: sql('sql/users/getSubscribers.sql'),
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
  readUserCaseTotals: sql('sql/control/cases/readUserCaseTotals.sql'),
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
  upsertTransportStations: sql(
    'sql/address/data-mos/upsertTransportStations.sql',
  ),
  getTransportStations: sql('sql/address/data-mos/getTransportStations.sql'),
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
  resetSessionErrorsById: sql('sql/address/results/resetSessionErrorsById.sql'),
  getAddressResultsBySessionId: sql(
    'sql/address/results/getAddressResultsBySessionId.sql',
  ),
  getTwoListsResultsBySessionId: sql(
    'sql/address/results/getTwoListsResultsBySessionId.sql',
  ),
  addUnomsToResultAddress: sql(
    'sql/address/results/addUnomsToResultAddress.sql',
  ),
};

export const rates = {
  getDailyUsage: sql('sql/address/rates/getDailyUsage.sql'),
  insertSpendRates: sql('sql/address/rates/insertSpendRates.sql'),
};

export const equityClassificators = {
  readBuildingsClassificator: sql(
    'sql/equity/classificators/readBuildingsClassificator.sql',
  ),
  readObjectStatusClassificator: sql(
    'sql/equity/classificators/readObjectStatusClassificator.sql',
  ),
  readObjectTypeClassificator: sql(
    'sql/equity/classificators/readObjectTypeClassificator.sql',
  ),
  readOperationTypeClassificator: sql(
    'sql/equity/classificators/readOperationTypeClassificator.sql',
  ),
  readImportantOperationTypeClassificator: sql(
    'sql/equity/classificators/readImportantOperationTypeClassificator.sql',
  ),
};

export const equityObjects = {
  readEquityObjectsTotals: sql(
    'sql/equity/objects/readEquityObjectsTotals.sql',
  ),
  readEquityObjectsTimeline: sql(
    'sql/equity/objects/readEquityObjectsTimeline.sql',
  ),
  readComplexList: sql('sql/equity/objects/readComplexList.sql'),
};

export const equityClaims = {
  updateClaimsTriggerInfo: sql('sql/equity/claims/updateClaimsTriggerInfo.sql'),
};

export const equityOperations = {
  updateOperationsTriggerInfo: sql(
    'sql/equity/operations/updateOperationsTriggerInfo.sql',
  ),
};
