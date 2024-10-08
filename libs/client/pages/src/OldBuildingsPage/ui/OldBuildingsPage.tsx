import { oldBuildingsColumns, useOldBuldings } from '@urgp/client/entities';
import {
  getRouteApi,
  useElementScrollRestoration,
  useNavigate,
} from '@tanstack/react-router';
import { cn, HStack, useDebounce, VirtualDataTable } from '@urgp/client/shared';
import {
  LoadedResultCounter,
  OldBuildingsCard,
  OldBuildingsFilter,
} from '@urgp/client/widgets';
import { useCallback, useState } from 'react';
import {
  GetOldBuldingsDto,
  OldBuildingsPageSearch,
} from '@urgp/shared/entities';

const OldBuildingsPage = (): JSX.Element => {
  const filters = getRouteApi(
    '/renovation/oldbuildings',
  ).useSearch() as OldBuildingsPageSearch;
  const debouncedFilters = useDebounce(
    {
      ...filters,
      tab: undefined,
      selectedBuildingId: undefined,
      apartment: undefined,
      sortingKey: undefined,
      sortingDirection: undefined,
    },
    200,
  );

  const navigate = useNavigate({ from: '/renovation/oldbuildings' });
  const [offset, setOffset] = useState(0);

  const {
    currentData: buildings,
    isLoading,
    isFetching,
  } = useOldBuldings({
    ...(debouncedFilters as OldBuildingsPageSearch),
    offset,
  });

  const setFilters = useCallback(
    (value: OldBuildingsPageSearch) => {
      // setCurrentAddress(null);
      navigate({
        search: (prev: GetOldBuldingsDto) => ({
          ...prev,
          selectedBuildingId: undefined,
          apartment: undefined,
          ...value,
        }),
      });
    },
    [navigate],
  );

  const scrollRestorationId = 'oldBuildingsScrollRestorationId';
  const scrollEntry = useElementScrollRestoration({
    id: scrollRestorationId,
  });

  return (
    <>
      <HStack justify={'start'} className="w-full pr-2">
        <OldBuildingsFilter filters={filters} setFilters={setFilters} />
        <LoadedResultCounter
          className="ml-auto"
          currentCount={buildings?.length}
          totalCount={buildings?.length}
          isFetching={isFetching}
        />
      </HStack>

      <div className={'relative flex h-[calc(100vh-3.5rem)] w-full'}>
        <VirtualDataTable
          initialOffset={scrollEntry?.scrollY}
          data-scroll-restoration-id={scrollRestorationId}
          onRowClick={(row) => {
            // переделать в полностью контролируемый селект?
            row.toggleSelected();
            navigate({
              search: (prev: GetOldBuldingsDto) => ({
                ...prev,
                selectedBuildingId:
                  row?.original?.id === filters.selectedBuildingId
                    ? undefined
                    : row?.original?.id,
                apartment: undefined,
              }),
            });
          }}
          className={cn(
            'bg-background absolute left-0 h-full transition-all ease-in-out',
            filters.selectedBuildingId && buildings
              ? filters.apartment
                ? 'w-[calc(100%-var(--sidebar-width)-var(--messagebar-width)-var(--detailsbar-width)-1.5rem)]'
                : 'w-[calc(100%-var(--sidebar-width)-0.5rem)]'
              : 'w-[calc(100%)]',
          )}
          columns={oldBuildingsColumns}
          data={buildings || []}
          isFetching={isLoading || isFetching}
          totalCount={buildings?.length ?? 0}
          clientSide
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
              : [
                  {
                    id: 'district',
                    desc: false,
                  },
                ]
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
        {buildings && (
          <OldBuildingsCard
            building={
              buildings?.find((b) => b.id === filters.selectedBuildingId) ||
              null
            }
            onClose={() =>
              navigate({
                search: (prev: GetOldBuldingsDto) => ({
                  ...prev,
                  selectedBuildingId: undefined,
                }),
              })
            }
            className={cn(
              'absolute right-0 top-0 bottom-0 h-full transition-all ease-in-out',
              filters?.selectedBuildingId ? 'w-sidebar' : 'hidden w-0',
            )}
          />
        )}
      </div>
    </>
  );
};

export { OldBuildingsPage };
