import { Row } from '@tanstack/react-table';

import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  EquityObjectCard,
  equityObjectsColumns,
  equityObjectsGlobalFilterFn,
  equityOperationLogColumns,
  equityOperationLogGlobalFilterFn,
  useEquityObjects,
  useEquityOperationLog,
} from '@urgp/client/entities';
import {
  cn,
  NAVBAR_WIDTH,
  selectEquityObjectTableColumns,
  selectEquityOperationLogTableColumns,
  SidebarInset,
  TooltipProvider,
  VirtualDataTable,
} from '@urgp/client/shared';
import {
  ControlSidePanel,
  EquityObjectsFilterSidebar,
  EquityObjectSidePanel,
  EquityOperationLogFilterSidebar,
  SelectedEquityObjectsActionBar,
} from '@urgp/client/widgets';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  EquityOperationLogItem,
  EquityOperationLogPageSearch,
} from '@urgp/shared/entities';
import { EquityOperationLogPageHeader } from './EquityOperationLogPageHeader';

const EquityOperationLogPage = (): JSX.Element => {
  // const i = useUserAbility();
  // const readMode = i.can('read-all', 'Case') ? 'all' : undefined;

  const { data, isLoading, isFetching } = useEquityOperationLog();
  const columnVisibility = useSelector(selectEquityOperationLogTableColumns);

  const [selected, setSelected] = useState<Row<EquityOperationLogItem>[]>([]); // Этот селектед не тот селектед!
  const [filtered, setFiltered] = useState<Row<EquityOperationLogItem>[]>([]);

  // const isMobile = useIsMobile();
  const navigate = useNavigate({ from: '/equity/operations' });
  const search = getRouteApi(
    '/equity/operations',
  ).useSearch() as EquityOperationLogPageSearch;

  const currentIndex = filtered?.findIndex(
    (row) => row.original.id === search?.selectedObject,
  );

  return (
    <TooltipProvider delayDuration={50}>
      <EquityOperationLogFilterSidebar
        side="left"
        className={`left-[${NAVBAR_WIDTH}]`}
      />

      <SidebarInset className="overflow-hidden">
        <main className="h-screen flex-col flex-wrap">
          <EquityOperationLogPageHeader
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
            globalFilterFn={equityOperationLogGlobalFilterFn}
            className={cn(
              'h-[calc(100vh-3rem)] flex-1 duration-200 ease-linear',
            )}
            columns={equityOperationLogColumns}
            data={data || []}
            isFetching={isLoading || isFetching}
            totalCount={data?.length ?? 0}
            enableMultiRowSelection={true}
            variant="borderless"
            compact={false}
            onRowClick={(row) => {
              navigate({
                search: (prev: EquityOperationLogPageSearch) => ({
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
                    search: (prev: EquityOperationLogPageSearch) => ({
                      ...prev,
                      sortKey: value[0].id,
                      sortDir: value[0].desc ? 'desc' : 'asc',
                    }),
                  })
                : navigate({
                    search: (prev: EquityOperationLogPageSearch) => ({
                      ...prev,
                      sortKey: undefined,
                      sortDir: undefined,
                    }),
                  });
            }}
          />
          <SelectedEquityObjectsActionBar selected={selected} />
        </main>
      </SidebarInset>
      <EquityObjectSidePanel
        isOpen={search.selectedObject !== undefined && currentIndex >= 0}
      >
        <EquityObjectCard
          equityObject={data?.find((o) => o.id === search.selectedObject)!}
          onClose={() =>
            navigate({
              search: (prev: EquityOperationLogPageSearch) => ({
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

export default EquityOperationLogPage;
