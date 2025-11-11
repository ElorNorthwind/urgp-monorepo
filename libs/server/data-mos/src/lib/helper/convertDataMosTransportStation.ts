import { Logger } from '@nestjs/common';
import {
  AdressRegistryRow,
  DataMosAdress,
  DataMosTransportStation,
  TransportStationRow,
} from '../../config/types';
import { calculateStreetFromDataMos } from './calculateStreetFromDataMos';

export const convertDataMosTransportStation = (
  stations: DataMosTransportStation[],
  type: TransportStationRow['station_type'],
): TransportStationRow[] => {
  return stations.map((st) => {
    const station =
      type === 'rail'
        ? st.Cells.Station || ''
        : type === 'mcd'
          ? st.Cells?.Diameter?.map((d) => d.StationName)?.join('; ') || ''
          : st.Cells?.NameOfStation || '';

    const line =
      type === 'rail'
        ? st.Cells?.RailwayLine + ' направление' || ''
        : type === 'mcd'
          ? st.Cells?.Diameter?.map(
              (d) => d?.DiameterName || '' + ' ' + d?.RouteName || '',
            )?.join('; ') || ''
          : st.Cells?.Line || '';

    const vestibule_type =
      type === 'rail'
        ? 'железнодорожная станция'
        : type === 'mcd'
          ? st.Cells?.TypeExit?.toLowerCase() || ''
          : st.Cells?.VestibuleType || '';

    return {
      id: st.global_id,
      name: st.Cells.Name,
      on_territory_of_moscow: st.Cells.OnTerritoryOfMoscow === 'да',
      adm_area: st.Cells.AdmArea,
      district: st.Cells.District,
      vestibule_type: vestibule_type,
      name_of_station: station,
      line: line,
      cultural_heritage_site_status: st.Cells.CulturalHeritageSiteStatus,
      repair_of_escalators: st.Cells.RepairOfEscalators,
      object_status: st.Cells.ObjectStatus,
      geo_data: st?.Cells?.geoData ? JSON.stringify(st.Cells.geoData) : 'null',
      station_type: type,
    };
  });
};
