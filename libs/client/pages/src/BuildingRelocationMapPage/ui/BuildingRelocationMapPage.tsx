import {
  oldApartmentColumns,
  OldApartmentDetailsSheet,
  OldBuildingRelocationMap,
  useOldApartments,
  useOldBuildingList,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  cn,
  Combobox,
  FacetFilter,
  useDebounce,
  VirtualDataTable,
} from '@urgp/client/shared';
import { LoadedResultCounter, OldApartmentFilter } from '@urgp/client/widgets';
import { useCallback, useState } from 'react';
import { GetOldBuldingsDto, OldApartmentSearch } from '@urgp/shared/entities';

const BuildingRelocationMapPage = (): JSX.Element => {
  const { buildingId } = getRouteApi(
    '/renovation/building-relocation-map',
  ).useSearch();

  const { data: oldBuildings, isLoading, isFetching } = useOldBuildingList();

  const navigate = useNavigate({ from: '/renovation/building-relocation-map' });

  return (
    <div className="isolate">
      <div className="absolute top-4 right-4">
        {isLoading || isFetching ? null : (
          <Combobox
            value={buildingId}
            items={oldBuildings || []}
            onSelect={(value: string) =>
              navigate({ search: { buildingId: parseInt(value) } })
            }
            className="w-[400px]"
          />
        )}
      </div>
      <OldBuildingRelocationMap
        buildingId={buildingId}
        className="relative -z-10 h-[calc(100vh-1rem)] w-full rounded border"
      ></OldBuildingRelocationMap>
    </div>
  );
};

export { BuildingRelocationMapPage };
