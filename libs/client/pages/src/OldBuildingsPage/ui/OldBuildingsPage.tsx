import {
  oldBuildingsColumns,
  oldBuildingsGlobalFilterFn,
  useOldBuldings,
} from '@urgp/client/entities';
import {
  getRouteApi,
  useElementScrollRestoration,
  useNavigate,
} from '@tanstack/react-router';
import { cn, VirtualDataTable } from '@urgp/client/shared';
import { OldBuildingsCard, OldBuildingsFilter } from '@urgp/client/widgets';
import { useCallback, useRef } from 'react';
import {
  GetOldBuldingsDto,
  OldBuilding,
  OldBuildingsPageSearch,
} from '@urgp/shared/entities';

const OldBuildingsPage = (): JSX.Element => {
  const filters = getRouteApi(
    '/renovation/oldbuildings',
  ).useSearch() as OldBuildingsPageSearch;

  const navigate = useNavigate({ from: '/renovation/oldbuildings' });
  const { currentData: buildings, isLoading, isFetching } = useOldBuldings();
  const filterRef = useRef<HTMLDivElement>(null);

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
      <OldBuildingsFilter
        // ref={filterRef}
        filters={filters}
        setFilters={setFilters}
        totalCount={buildings?.length}
        isFetching={isFetching}
      />

      <div className={'relative flex h-[calc(100vh-3.5rem)] w-full'}>
        <VirtualDataTable<OldBuilding, string | number | undefined>
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
          // @ts-expect-error no idea
          columns={oldBuildingsColumns}
          data={buildings || []}
          isFetching={isLoading || isFetching}
          totalCount={buildings?.length ?? 0}
          clientSide
          // callbackFn={() => setOffset(buildings?.length || 0)}
          // callbackMargin={3000}
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
          globalFilter={filters}
          globalFilterFn={oldBuildingsGlobalFilterFn}
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
