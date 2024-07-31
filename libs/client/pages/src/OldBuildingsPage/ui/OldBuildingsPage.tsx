import {
  OldBuildingsCard,
  oldBuildingsColumns,
  useOldBuldings,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { cn, HStack, useDebounce, VirtualDataTable } from '@urgp/client/shared';
import { LoadedResultCounter, OldBuildingsFilter } from '@urgp/client/widgets';
import { useCallback, useState } from 'react';
import { GetOldBuldingsDto, OldBuilding } from '@urgp/shared/entities';

const OldBuildingsPage = (): JSX.Element => {
  const filters = getRouteApi(
    '/renovation/oldbuildings',
  ).useSearch() as GetOldBuldingsDto;
  const debouncedFilters = useDebounce(filters, 200);

  const navigate = useNavigate({ from: '/renovation/oldbuildings' });
  const [offset, setOffset] = useState(0);

  const [currentAdress, setCurrentAddress] = useState<OldBuilding | null>(null);

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
      setCurrentAddress(null);
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
    <>
      <HStack justify={'between'} className="w-full pr-2">
        <OldBuildingsFilter filters={filters} setFilters={setFilters} />
        <LoadedResultCounter
          currentCount={buildings?.length}
          totalCount={buildings?.[0]?.totalCount}
          isFetching={isFetching}
        />
      </HStack>

      <HStack gap="s" className="h-[calc(100vh-3.5rem)] w-full overflow-hidden">
        <VirtualDataTable
          // onRowDoubleClick={() => setCurrentAddress(null)}
          onRowClick={(row) => {
            row.toggleSelected();
            setCurrentAddress(
              row?.original?.id === currentAdress?.id ? null : row?.original,
            );
          }}
          className={cn(
            'bg-background h-full transition-all ease-in-out',
            currentAdress ? 'w-[calc(100%-520px-0.5rem)]' : 'w-[calc(100%)]',
          )}
          columns={oldBuildingsColumns}
          data={buildings || []}
          // isFetching={true}
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
          initialState={{
            sorting: [
              {
                id: 'district',
                desc: false,
              },
            ],
          }}
        />
        <OldBuildingsCard
          building={currentAdress}
          onClose={() => setCurrentAddress(null)}
          className="h-full transition-all ease-in-out"
          width={520}
        />
      </HStack>
    </>
  );
};

export { OldBuildingsPage };
