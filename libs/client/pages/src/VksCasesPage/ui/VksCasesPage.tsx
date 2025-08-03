import { Row } from '@tanstack/react-table';

import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  EquityObjectCard,
  equityObjectsColumns,
  equityObjectsGlobalFilterFn,
  useVksCases,
  vksCasesColumns,
  vksCasesGlobalFilterFn,
} from '@urgp/client/entities';
import {
  cn,
  NAVBAR_WIDTH,
  selectVksCasesTableColumns,
  SidebarInset,
  TooltipProvider,
  VirtualDataTable,
} from '@urgp/client/shared';
import {
  EquityObjectsFilterSidebar,
  EquityObjectSidePanel,
  SelectedEquityObjectsActionBar,
  VksCasesFilterSidebar,
  VksCasesSidePanel,
} from '@urgp/client/widgets';
import {
  EquityObjectsPageSearch,
  VksCase,
  VksCasesPageSearch,
} from '@urgp/shared/entities';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { VksCasesPageHeader } from './VksCasesPageHeader';

const VksCasesPage = (): JSX.Element => {
  // const i = useUserAbility();
  // const readMode = i.can('read-all', 'Case') ? 'all' : undefined;

  const columnVisibility = useSelector(selectVksCasesTableColumns);

  const [selected, setSelected] = useState<Row<VksCase>[]>([]); // Этот селектед не тот селектед!
  const [filtered, setFiltered] = useState<Row<VksCase>[]>([]);

  // const isMobile = useIsMobile();
  const navigate = useNavigate({ from: '/vks/cases' });
  const search = getRouteApi('/vks/cases').useSearch() as VksCasesPageSearch;

  const { data, isLoading, isFetching } = useVksCases({
    dateFrom: search?.dateFrom || '01.07.2025',
    dateTo: search?.dateTo || 'infinity',
  });

  // ID прошлого и текущего дела
  const currentIndex = filtered?.findIndex(
    (row) => row.original.id === search?.selectedCase,
  );
  const prevObjectId = filtered?.[currentIndex - 1]?.original?.id;
  const nextObjectId = filtered?.[currentIndex + 1]?.original?.id;

  const onPrevObject = () => {
    if (prevObjectId) {
      navigate({
        search: (prev: VksCasesPageSearch) => ({
          ...prev,
          selectedCase: prevObjectId,
        }),
      });
    }
  };
  const onNextObject = () => {
    if (nextObjectId) {
      navigate({
        search: (prev: VksCasesPageSearch) => ({
          ...prev,
          selectedCase: nextObjectId,
        }),
      });
    }
  };

  return (
    <TooltipProvider delayDuration={50}>
      <VksCasesFilterSidebar side="left" className={`left-[${NAVBAR_WIDTH}]`} />

      <SidebarInset className="overflow-hidden">
        <main className="h-screen flex-col flex-wrap">
          <VksCasesPageHeader
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
            globalFilterFn={vksCasesGlobalFilterFn}
            className={cn(
              'h-[calc(100vh-3rem)] flex-1 duration-200 ease-linear',
            )}
            columns={vksCasesColumns}
            data={data || []}
            isFetching={isLoading || isFetching}
            totalCount={data?.length ?? 0}
            enableMultiRowSelection={true}
            variant="borderless"
            compact={false}
            onRowClick={(row) => {
              navigate({
                search: (prev: VksCasesPageSearch) => ({
                  ...prev,
                  selectedCase:
                    search.selectedCase === row.original.id
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
                    search: (prev: VksCasesPageSearch) => ({
                      ...prev,
                      sortKey: value[0].id,
                      sortDir: value[0].desc ? 'desc' : 'asc',
                    }),
                  })
                : navigate({
                    search: (prev: VksCasesPageSearch) => ({
                      ...prev,
                      sortKey: undefined,
                      sortDir: undefined,
                    }),
                  });
            }}
          />
          {/* <SelectedEquityObjectsActionBar selected={selected} /> */}
        </main>
      </SidebarInset>
      <VksCasesSidePanel
        isOpen={search.selectedCase !== undefined && currentIndex >= 0}
      >
        Тут будет карточка документа
        {/* <EquityObjectCard
          onPrevRow={prevObjectId ? onPrevObject : undefined}
          onNextRow={nextObjectId ? onNextObject : undefined}
          equityObject={data?.find((o) => o.id === search.selectedCase)!}
          onClose={() =>
            navigate({
              search: (prev: EquityObjectsPageSearch) => ({
                ...prev,
                selectedCase: undefined,
              }),
            })
          }
        /> */}
      </VksCasesSidePanel>
    </TooltipProvider>
  );
};

export default VksCasesPage;
