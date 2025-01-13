import { Row } from '@tanstack/react-table';

import {
  CaseCard,
  caseGlobalFilterFn,
  controlCasesColumns,
  useCases,
} from '@urgp/client/entities';
import {
  cn,
  NAVBAR_WIDTH,
  selectCurrentUser,
  SidebarInset,
  TooltipProvider,
  VirtualDataTable,
} from '@urgp/client/shared';
import { CasesPageSearchDto, Case } from '@urgp/shared/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { CaseFilterSidebar, ControlSidePanel } from '@urgp/client/widgets';
import { CasesPageHeader } from './CasesPageHeader';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ControlCasesPage = (): JSX.Element => {
  const { data: cases, isLoading, isFetching } = useCases();
  const [selected, setSelected] = useState<Row<Case>[]>([]);
  const [filtered, setFiltered] = useState<Row<Case>[]>([]);
  // const [facets, setFacets] = useState<Map<any, number>>(new Map());

  // let facets: Record<string, number> = {};

  // filtered.forEach((row) => {
  //   facets[row.original.class] == facets[row.original.class]
  //     ? facets[row.original.class]++
  //     : 1;
  // });

  const user = useSelector(selectCurrentUser);

  // const isMobile = useIsMobile();
  const navigate = useNavigate({ from: '/control' });
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;

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

  // // Adds a keyboard shortcut to navigate cases
  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === 'ArrowUp' && prevCaseId) {
  //       event.preventDefault();
  //       onPrevCase();
  //     }
  //     if (event.key === 'ArrowDown' && nextCaseId) {
  //       event.preventDefault();
  //       onNextCase();
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, [prevCaseId, nextCaseId, navigate]);

  return (
    <TooltipProvider delayDuration={50}>
      <CaseFilterSidebar side="left" className={`left-[${NAVBAR_WIDTH}]`} />
      <SidebarInset className="overflow-hidden">
        <main className=" h-screen flex-col flex-wrap">
          <CasesPageHeader total={cases?.length} filtered={filtered.length} />
          <VirtualDataTable
            setSelectedRows={setSelected}
            setFilteredRows={setFiltered}
            clientSide
            globalFilter={search}
            globalFilterFn={caseGlobalFilterFn}
            className={cn('h-full flex-1 duration-200 ease-linear')}
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
