import { Row } from '@tanstack/react-table';

import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  CaseCard,
  caseGlobalFilterFn,
  equityObjectsColumns,
  equityObjectsGlobalFilterFn,
  incidentsTableColumns,
  useCases,
  useEquityObjects,
} from '@urgp/client/entities';
import {
  cn,
  NAVBAR_WIDTH,
  selectEquityObjectTableColumns,
  selectIncidentTableColumns,
  SidebarInset,
  TooltipProvider,
  useUserAbility,
  VirtualDataTable,
} from '@urgp/client/shared';
import {
  CaseFilterSidebar,
  ControlSidePanel,
  EquityObjectsFilterSidebar,
  SelectedCasesActionBar,
} from '@urgp/client/widgets';
import {
  CaseFull,
  CasesPageSearchDto,
  EquityObject,
  EquityObjectsPageSearch,
  ViewStatus,
} from '@urgp/shared/entities';
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
          selectedCase: prevObjectId,
        }),
      });
    }
  };
  const onNextObject = () => {
    if (nextObjectId) {
      navigate({
        search: (prev: EquityObjectsPageSearch) => ({
          ...prev,
          selectedCase: nextObjectId,
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
      <ControlSidePanel
        isOpen={search.selectedObject !== undefined && currentIndex >= 0}
      >
        <div className="p-10">Тут будет карочка объекта</div>
        {/* <CaseCard
          onPrevCase={prevObjectId ? onPrevObject : undefined}
          onNextCase={nextObjectId ? onNextCase : undefined}
          controlCase={cases?.find((c) => c.id === search.selectedCase)!}
          onClose={() =>
            navigate({
              search: (prev: CasesPageSearchDto) => ({
                ...prev,
                selectedCase: undefined,
              }),
            })
          }
        /> */}
      </ControlSidePanel>
    </TooltipProvider>
  );
};

export default EquityObjectsPage;
