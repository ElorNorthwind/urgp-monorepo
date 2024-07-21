import { oldBuildingsColumns, useOldBuldings } from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  HStack,
  useDebounce,
  VirtualDataTable,
  VStack,
} from '@urgp/client/shared';
import { LoadedResultCounter, OldBuildingsFilter } from '@urgp/client/widgets';
import { useCallback, useState } from 'react';
import { GetOldBuldingsDto } from '@urgp/shared/entities';

const OldBuildingsPage = (): JSX.Element => {
  const filters = getRouteApi('/oldbuildings').useSearch() as GetOldBuldingsDto;
  const debouncedFilters = useDebounce(filters, 200);

  const navigate = useNavigate({ from: '/oldbuildings' });
  const [offset, setOffset] = useState(0);

  const {
    currentData: buildings,
    isLoading,
    isFetching,
  } = useOldBuldings({
    ...(debouncedFilters as Partial<GetOldBuldingsDto>),
    offset,
  });

  const setFilters = useCallback(
    (value: Partial<GetOldBuldingsDto>) => {
      navigate({
        search: (prev: GetOldBuldingsDto) => ({
          ...prev,
          ...value,
        }),
      });
    },
    [navigate],
  );

  return (
    <VStack gap="s" align="start" className="relative w-full p-2">
      <HStack justify={'between'} className="w-full pr-2">
        <OldBuildingsFilter filters={filters} setFilters={setFilters} />
        <LoadedResultCounter
          currentCount={buildings?.length}
          totalCount={buildings?.[0]?.totalCount}
          isFetching={isFetching}
        />
      </HStack>
      <VirtualDataTable
        className="h-[calc(100vh-4rem)] w-full"
        columns={oldBuildingsColumns}
        data={buildings || []}
        isFetching={isLoading || isFetching}
        totalCount={buildings?.[0]?.totalCount ?? 0}
        callbackFn={() => setOffset(buildings?.length || 0)}
        callbackMargin={1500}
      />
    </VStack>
  );
};

export { OldBuildingsPage };
