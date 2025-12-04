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
  plots: sql('sql/renovation/plots.sql'),
  plotsStatusTotals: sql('sql/renovation/plotsStatusTotals.sql'),
  plotsDeviationTotals: sql('sql/renovation/plotsDeviationTotals.sql'),
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

export const renovationSync = {
  oldApartmentsSync: sql('sql/renovation-sync/oldApartmentsSync.sql'),
  newApartmentsIdSync: sql('sql/renovation-sync/newApartmentsIdSync.sql'),
  newApartmentsSync: sql('sql/renovation-sync/newApartmentsSync.sql'),
  offerSync: sql('sql/renovation-sync/offerSync.sql'),
  orderSync: sql('sql/renovation-sync/orderSync.sql'),
  contractSync: sql('sql/renovation-sync/contractSync.sql'),
  messageServerReadById: sql('sql/renovation-sync/messageServerReadById.sql'),
  messageServerReadByAppartId: sql(
    'sql/renovation-sync/messageServerReadByAppartId.sql',
  ),
  messageServerReadByUserUuid: sql(
    'sql/renovation-sync/messageServerReadByUserUuid.sql',
  ),
  messageServerCreate: sql('sql/renovation-sync/messageServerCreate.sql'),
  messageServerUpdate: sql('sql/renovation-sync/messageServerUpdate.sql'),
  messageServerDelete: sql('sql/renovation-sync/messageServerDelete.sql'),
};
