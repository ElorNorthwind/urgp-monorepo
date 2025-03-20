import { Row } from '@tanstack/react-table';

import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  CaseCard,
  caseGlobalFilterFn,
  incidentsTableColumns,
  useCases,
} from '@urgp/client/entities';
import {
  cn,
  NAVBAR_WIDTH,
  selectIncidentTableColumns,
  SidebarInset,
  TooltipProvider,
  useUserAbility,
  VirtualDataTable,
} from '@urgp/client/shared';
import {
  CaseFilterSidebar,
  ControlSidePanel,
  SelectedCasesActionBar,
} from '@urgp/client/widgets';
import {
  CaseFull,
  CasesPageSearchDto,
  ViewStatus,
} from '@urgp/shared/entities';
import { useState } from 'react';
import { CasesPageHeader } from './CasesPageHeader';
import { useSelector } from 'react-redux';

const ControlCasesPage = (): JSX.Element => {
  const i = useUserAbility();

  const readMode = i.can('read-all', 'Case') ? 'all' : undefined;

  const {
    data: cases,
    isLoading,
    isFetching,
  } = useCases({ visibility: readMode });
  const columnVisibility = useSelector(selectIncidentTableColumns);
  const [selected, setSelected] = useState<Row<CaseFull>[]>([]); // Этот селектед не тот селектед!
  const [filtered, setFiltered] = useState<Row<CaseFull>[]>([]);

  // const isMobile = useIsMobile();
  const navigate = useNavigate({ from: '/control/cases' });
  const search = getRouteApi(
    '/control/cases',
  ).useSearch() as CasesPageSearchDto;

  // ID прошлого и текущего дела
  const currentIndex = filtered?.findIndex(
    (row) => row.original.id === search.selectedCase,
  );
  const prevCaseId = filtered?.[currentIndex - 1]?.original?.id;
  const nextCaseId = filtered?.[currentIndex + 1]?.original?.id;

  const onPrevCase = () => {
    if (prevCaseId) {
      navigate({
        search: (prev: CasesPageSearchDto) => ({
          ...prev,
          selectedCase: prevCaseId,
        }),
      });
    }
  };
  const onNextCase = () => {
    if (nextCaseId) {
      navigate({
        search: (prev: CasesPageSearchDto) => ({
          ...prev,
          selectedCase: nextCaseId,
        }),
      });
    }
  };

  return (
    <TooltipProvider delayDuration={50}>
      <CaseFilterSidebar side="left" className={`left-[${NAVBAR_WIDTH}]`} />

      <SidebarInset className="overflow-hidden">
        <main className="h-screen flex-col flex-wrap">
          <CasesPageHeader
            total={cases?.length}
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
            globalFilterFn={caseGlobalFilterFn}
            className={cn(
              'h-[calc(100vh-3rem)] flex-1 duration-200 ease-linear',
            )}
            columns={incidentsTableColumns}
            data={cases || []}
            isFetching={isLoading || isFetching}
            totalCount={cases?.length ?? 0}
            enableMultiRowSelection={true}
            variant="borderless"
            compact={false}
            onRowClick={(row) => {
              navigate({
                search: (prev: CasesPageSearchDto) => ({
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
                    search: (prev: CasesPageSearchDto) => ({
                      ...prev,
                      sortKey: value[0].id,
                      sortDir: value[0].desc ? 'desc' : 'asc',
                    }),
                  })
                : navigate({
                    search: (prev: CasesPageSearchDto) => ({
                      ...prev,
                      sortKey: undefined,
                      sortDir: undefined,
                    }),
                  });
            }}
          />
          <SelectedCasesActionBar selected={selected} />
        </main>
      </SidebarInset>
      <ControlSidePanel
        isOpen={search.selectedCase !== undefined && currentIndex >= 0}
      >
        <CaseCard
          onPrevCase={prevCaseId ? onPrevCase : undefined}
          onNextCase={nextCaseId ? onNextCase : undefined}
          controlCase={cases?.find((c) => c.id === search.selectedCase)!}
          onClose={() =>
            navigate({
              search: (prev: CasesPageSearchDto) => ({
                ...prev,
                selectedCase: undefined,
              }),
            })
          }
        />
      </ControlSidePanel>
    </TooltipProvider>
  );
};

export default ControlCasesPage;
