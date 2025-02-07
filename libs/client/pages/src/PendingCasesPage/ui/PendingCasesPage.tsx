import { Row, VisibilityState } from '@tanstack/react-table';

import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  CaseCard,
  caseGlobalFilterFn,
  pendingCasesColumns,
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
import { CaseFull, CasesPageSearchDto } from '@urgp/shared/entities';
import { useMemo, useState } from 'react';
import { CasesPageHeader } from '../../ControlCasesPage/ui/CasesPageHeader';

const defaultHiddenColumns = ['viewStatus', 'externalCases', 'type'];

const PendingCasesPage = (): JSX.Element => {
  const { data: cases, isLoading, isFetching } = useCases(undefined);
  const [selected, setSelected] = useState<Row<CaseFull>[]>([]);
  const [filtered, setFiltered] = useState<Row<CaseFull>[]>([]);

  const filteredCases = useMemo(
    () =>
      cases?.filter(
        (caseItem) => caseItem?.actions && caseItem?.actions.length > 0,
      ),
    [cases],
  );

  // const isMobile = useIsMobile();
  const navigate = useNavigate({ from: '/control/pending' });
  const search = getRouteApi(
    '/control/pending',
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
    ...pendingCasesColumns
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
            columns={pendingCasesColumns}
            data={filteredCases || []}
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

export { PendingCasesPage };
