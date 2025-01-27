import { Row, VisibilityState } from '@tanstack/react-table';

import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  CaseCard,
  caseGlobalFilterFn,
  controlCasesColumns,
  useCases,
} from '@urgp/client/entities';
import {
  cn,
  NAVBAR_WIDTH,
  SidebarInset,
  TooltipProvider,
  VirtualDataTable,
} from '@urgp/client/shared';
import { CaseFilterSidebar, ControlSidePanel } from '@urgp/client/widgets';
import { Case, CasesPageSearchDto } from '@urgp/shared/entities';
import { useState } from 'react';
import { CasesPageHeader } from './CasesPageHeader';

const defaultHiddenColumns = ['viewStatus'];

const ControlCasesPage = (): JSX.Element => {
  const { data: cases, isLoading, isFetching } = useCases();
  const [selected, setSelected] = useState<Row<Case>[]>([]); // Этот селектед не тот селектед!
  const [filtered, setFiltered] = useState<Row<Case>[]>([]);

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

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ...controlCasesColumns
      .filter((col) => col.enableHiding !== false)
      .reduce((acc, cur) => {
        return cur.id ? { ...acc, [cur.id]: true } : acc;
      }, {}),
    ...defaultHiddenColumns.reduce((acc, cur) => {
      return { ...acc, [cur]: false };
    }, {}),
  } as VisibilityState);

  return (
    <TooltipProvider delayDuration={50}>
      <CaseFilterSidebar side="left" className={`left-[${NAVBAR_WIDTH}]`} />
      <SidebarInset className="overflow-hidden">
        <main className="h-screen flex-col flex-wrap">
          <CasesPageHeader
            total={cases?.length}
            filtered={filtered.length}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
          <VirtualDataTable
            columnVisibility={columnVisibility}
            setSelectedRows={setSelected}
            setFilteredRows={setFiltered}
            clientSide
            globalFilter={search}
            globalFilterFn={caseGlobalFilterFn}
            className={cn(
              'h-[calc(100vh-3rem)] flex-1 duration-200 ease-linear',
            )}
            columns={controlCasesColumns}
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
        </main>
      </SidebarInset>
      <ControlSidePanel isOpen={search.selectedCase !== undefined}>
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

export { ControlCasesPage };
