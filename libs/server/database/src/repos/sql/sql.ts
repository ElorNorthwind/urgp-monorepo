import { QueryFile } from 'pg-promise';
import { join as joinPath } from 'path';

// Helper for linking to external query files:
function sql(file: string) {
  const fullPath = joinPath(__dirname, file); // generating full path;
  return new QueryFile(fullPath, { minify: true });
}

export const renovation = {
  oldBuildings: sql('sql/renovation/oldBuildings.sql'),
  oldBuldingsGeoJson: sql('sql/renovation/oldBuildingsGeoJson.sql'),
  oldApartments: sql('sql/renovation/oldApartmentsList.sql'),
  okrugTotalHouses: sql('sql/renovation/okrugTotalHouses.sql'),
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
};

export const users = {
  getByLogin: sql('sql/users/getByLogin.sql'),
  getById: sql('sql/users/getUserById.sql'),
  create: sql('sql/users/create.sql'),
  incrementTokenVersion: sql('sql/users/incrementTokenVersion.sql'),
  changePassword: sql('sql/users/changePassword.sql'),
};
