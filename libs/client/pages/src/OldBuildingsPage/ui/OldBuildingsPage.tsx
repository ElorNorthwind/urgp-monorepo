import {
  OldBuildingsCard,
  oldBuildingsColumns,
  useOldBuldings,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  cn,
  HStack,
  TooltipProvider,
  useDebounce,
  VirtualDataTable,
  VStack,
} from '@urgp/client/shared';
import { LoadedResultCounter, OldBuildingsFilter } from '@urgp/client/widgets';
import { useCallback, useEffect, useState } from 'react';
import { GetOldBuldingsDto, OldBuilding } from '@urgp/shared/entities';

const OldBuildingsPage = (): JSX.Element => {
  const filters = getRouteApi('/oldbuildings').useSearch() as GetOldBuldingsDto;
  const debouncedFilters = useDebounce(filters, 200);

  const navigate = useNavigate({ from: '/oldbuildings' });
  const [offset, setOffset] = useState(0);

  const [currentAdress, setCurrentAddress] = useState<OldBuilding | null>(null);

  // // for debug only. Cos Im THAT bad
  // const [sorting, setSortting] = useState(
  //   [] as { id: string; desc: boolean }[],
  // );
  // useEffect(() => {
  //   console.log(JSON.stringify(sorting, null, 2));
  // }, [sorting]);

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
      <TooltipProvider>
        <HStack
          gap="s"
          className="h-[calc(100vh-3.5rem)] w-full overflow-hidden"
        >
          <VirtualDataTable
            // onRowDoubleClick={() => setCurrentAddress(null)}
            onRowClick={(row) => {
              row.toggleSelected();
              setCurrentAddress(
                row?.original?.id === currentAdress?.id ? null : row?.original,
              );
            }}
            className={cn(
              'h-full transition-all',
              currentAdress ? 'w-[calc(100%-520px-0.5rem)]' : 'w-[calc(100%)]',
            )}
            columns={oldBuildingsColumns}
            data={buildings || []}
            isFetching={isLoading || isFetching}
            totalCount={buildings?.[0]?.totalCount ?? 0}
            callbackFn={() => setOffset(buildings?.length || 0)}
            callbackMargin={3000}
            enableMultiRowSelection={false}
            sorting={
              filters?.sortingKey
                ? [
                    {
                      id: filters.sortingKey,
                      desc: filters.sortingDirection === 'desc',
                    } as { id: string; desc: boolean },
                  ]
                : []
            }
            setSorting={(value) => {
              value && value.length > 0
                ? setFilters({
                    sortingKey: value[0].id,
                    sortingDirection: value[0].desc ? 'desc' : 'asc',
                  })
                : setFilters({
                    sortingKey: undefined,
                    sortingDirection: undefined,
                  });
            }}
          />
          <OldBuildingsCard
            building={currentAdress}
            onClose={() => setCurrentAddress(null)}
            className="h-full"
            width={520}
          />
        </HStack>
      </TooltipProvider>
    </VStack>
  );
};

export { OldBuildingsPage };
