import {
  getRouteApi,
  useElementScrollRestoration,
  useNavigate,
} from '@tanstack/react-router';
import { Row } from '@tanstack/react-table';
import {
  newBuildingsColumns,
  newBuildingsGlobalFilterFn,
  oldBuildingsColumns,
  oldBuildingsGlobalFilterFn,
  useNewBuildings,
  useOldBuldings,
} from '@urgp/client/entities';
import { cn, VirtualDataTable } from '@urgp/client/shared';
import {
  NewBuildingsFilter,
  OldBuildingCard,
  OldBuildingsFilter,
} from '@urgp/client/widgets';
import {
  GetOldBuldingsDto,
  NewBuildingsSearch,
  OldBuilding,
  OldBuildingsPageSearch,
  RenovationNewBuilding,
} from '@urgp/shared/entities';
import { useCallback, useState } from 'react';

const NewBuildingsPage = (): JSX.Element => {
  const filters = getRouteApi(
    '/renovation/newbuildings',
  ).useSearch() as NewBuildingsSearch;

  const navigate = useNavigate({ from: '/renovation/newbuildings' });
  const { data, isLoading, isFetching } = useNewBuildings();
  const [filtered, setFiltered] = useState<Row<RenovationNewBuilding>[]>([]);

  const setFilters = useCallback(
    (value: NewBuildingsSearch) => {
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

  const scrollRestorationId = 'newBuildingsScrollRestorationId';
  const scrollEntry = useElementScrollRestoration({
    id: scrollRestorationId,
  });

  return (
    <>
      <NewBuildingsFilter
        // ref={filterRef}
        filters={filters}
        setFilters={setFilters}
        totalCount={data?.length}
        filteredCount={filtered?.length}
        isFetching={isFetching}
      />
      <div className={'relative flex h-[calc(100vh-3.5rem)] w-full'}>
        <VirtualDataTable<RenovationNewBuilding, string | number | undefined>
          initialOffset={scrollEntry?.scrollY}
          data-scroll-restoration-id={scrollRestorationId}
          setFilteredRows={setFiltered}
          // onRowClick={(row) => {
          //   // переделать в полностью контролируемый селект?
          //   row.toggleSelected();
          //   navigate({
          //     search: (prev: GetOldBuldingsDto) => ({
          //       ...prev,
          //       selectedBuildingId:
          //         row?.original?.id === filters.selectedBuildingId
          //           ? undefined
          //           : row?.original?.id,
          //       apartment: undefined,
          //     }),
          //   });
          // }}
          className={cn(
            'bg-background absolute left-0 h-full transition-all ease-in-out',
            filters.selectedBuildingId && data
              ? filters.apartment
                ? filters.apartment === -1
                  ? 'w-[calc(100%-var(--renovation-sidebar-width)-var(--detailsbar-width)-1rem)]'
                  : 'w-[calc(100%-var(--renovation-sidebar-width)-var(--messagebar-width)-var(--detailsbar-width)-1.5rem)]'
                : 'w-[calc(100%-var(--renovation-sidebar-width)-0.5rem)]'
              : 'w-[calc(100%)]',
          )}
          rowClassName="hover:bg-white/0"
          columns={newBuildingsColumns}
          data={data || []}
          isFetching={isLoading || isFetching}
          totalCount={data?.length ?? 0}
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
              : undefined
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
          globalFilterFn={newBuildingsGlobalFilterFn}
          initialState={{
            sorting: [
              {
                id: 'district',
                desc: false,
              },
            ],
          }}
        />
        {data && (
          <OldBuildingCard
            mode="plot"
            building={
              data
                ?.find((p) =>
                  p.oldBuildings.some(
                    (b) => b.id === filters.selectedBuildingId,
                  ),
                )
                ?.oldBuildings.find(
                  (b) => b.id === filters.selectedBuildingId,
                ) || null
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
              'absolute bottom-0 right-0 top-0 h-full transition-all ease-in-out',
              filters?.selectedBuildingId
                ? 'w-renovationsidebar'
                : 'hidden w-0',
            )}
          />
        )}
      </div>
    </>
  );
};

export { NewBuildingsPage };
