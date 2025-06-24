import { Row } from '@tanstack/react-table';

import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  EquityObjectCard,
  equityObjectsColumns,
  equityObjectsGlobalFilterFn,
  useEquityObjects,
} from '@urgp/client/entities';
import {
  cn,
  NAVBAR_WIDTH,
  selectEquityObjectTableColumns,
  SidebarInset,
  TooltipProvider,
  VirtualDataTable,
} from '@urgp/client/shared';
import {
  ControlSidePanel,
  EquityObjectsFilterSidebar,
  EquityObjectSidePanel,
} from '@urgp/client/widgets';
import { EquityObject, EquityObjectsPageSearch } from '@urgp/shared/entities';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { EquityObjectsPageHeader } from './EquityObjectsPageHeader';

const EquityObjectsPage = (): JSX.Element => {
  // const i = useUserAbility();
  // const readMode = i.can('read-all', 'Case') ? 'all' : undefined;

  const { data, isLoading, isFetching } = useEquityObjects();
  const columnVisibility = useSelector(selectEquityObjectTableColumns);

  const [selected, setSelected] = useState<Row<EquityObject>[]>([]); // Этот селектед не тот селектед!
  const [filtered, setFiltered] = useState<Row<EquityObject>[]>([]);

  // const isMobile = useIsMobile();
  const navigate = useNavigate({ from: '/equity/objects' });
  const search = getRouteApi(
    '/equity/objects',
  ).useSearch() as EquityObjectsPageSearch;

  // ID прошлого и текущего дела
  const currentIndex = filtered?.findIndex(
    (row) => row.original.id === search?.selectedObject,
  );
  const prevObjectId = filtered?.[currentIndex - 1]?.original?.id;
  const nextObjectId = filtered?.[currentIndex + 1]?.original?.id;

  const onPrevObject = () => {
    if (prevObjectId) {
      navigate({
        search: (prev: EquityObjectsPageSearch) => ({
          ...prev,
          selectedObject: prevObjectId,
        }),
      });
    }
  };
  const onNextObject = () => {
    if (nextObjectId) {
      navigate({
        search: (prev: EquityObjectsPageSearch) => ({
          ...prev,
          selectedObject: nextObjectId,
        }),
      });
    }
  };

  return (
    <TooltipProvider delayDuration={50}>
      <EquityObjectsFilterSidebar
        side="left"
        className={`left-[${NAVBAR_WIDTH}]`}
      />

      <SidebarInset className="overflow-hidden">
        <main className="h-screen flex-col flex-wrap">
          <EquityObjectsPageHeader
            total={data?.length}
            filtered={filtered.length}
            exportedRows={filtered}
          />
          <VirtualDataTable
            autofocus
            columnVisibility={columnVisibility}
            setSelectedRows={setSelected}
            setFilteredRows={setFiltered}
            clientSide
            globalFilter={search}
            globalFilterFn={equityObjectsGlobalFilterFn}
            className={cn(
              'h-[calc(100vh-3rem)] flex-1 duration-200 ease-linear',
            )}
            columns={equityObjectsColumns}
            data={data || []}
            isFetching={isLoading || isFetching}
            totalCount={data?.length ?? 0}
            enableMultiRowSelection={true}
            variant="borderless"
            compact={false}
            onRowClick={(row) => {
              navigate({
                search: (prev: EquityObjectsPageSearch) => ({
                  ...prev,
                  selectedObject:
                    search.selectedObject === row.original.id
                      ? undefined
                      : row.original.id,
                }),
              });
            }}
            sorting={
              search?.sortKey
                ? [
                    {
                      id: search.sortKey,
                      desc: search?.sortDir === 'desc',
                    } as { id: string; desc: boolean },
                  ]
                : undefined
            }
            setSorting={(value) => {
              value && value.length > 0
                ? navigate({
                    search: (prev: EquityObjectsPageSearch) => ({
                      ...prev,
                      sortKey: value[0].id,
                      sortDir: value[0].desc ? 'desc' : 'asc',
                    }),
                  })
                : navigate({
                    search: (prev: EquityObjectsPageSearch) => ({
                      ...prev,
                      sortKey: undefined,
                      sortDir: undefined,
                    }),
                  });
            }}
          />
          {/* <SelectedCasesActionBar selected={selected} /> */}
        </main>
      </SidebarInset>
      <EquityObjectSidePanel
        isOpen={search.selectedObject !== undefined && currentIndex >= 0}
      >
        <EquityObjectCard
          onPrevRow={prevObjectId ? onPrevObject : undefined}
          onNextRow={nextObjectId ? onNextObject : undefined}
          equityObject={data?.find((o) => o.id === search.selectedObject)!}
          onClose={() =>
            navigate({
              search: (prev: EquityObjectsPageSearch) => ({
                ...prev,
                selectedObject: undefined,
              }),
            })
          }
        />
      </EquityObjectSidePanel>
    </TooltipProvider>
  );
};

export default EquityObjectsPage;
