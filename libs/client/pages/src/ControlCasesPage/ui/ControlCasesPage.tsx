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
  SidebarInset,
  TooltipProvider,
  useIsMobile,
  VirtualDataTable,
} from '@urgp/client/shared';
import { CasesPageSearchDto, CaseWithStatus } from '@urgp/shared/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { CaseFilterSidebar, ControlSidePanel } from '@urgp/client/widgets';
import { CasesPageHeader } from './CasesPageHeader';
import { useState } from 'react';

const ControlCasesPage = (): JSX.Element => {
  const { data: cases, isLoading, isFetching } = useCases();
  const [selected, setSelected] = useState<Row<CaseWithStatus>[]>([]);
  const [filtered, setFiltered] = useState<Row<CaseWithStatus>[]>([]);

  // const isMobile = useIsMobile();
  const navigate = useNavigate({ from: '/control' });
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;
  return (
    <TooltipProvider delayDuration={50}>
      <CaseFilterSidebar
        side="left"
        className={`left-[${NAVBAR_WIDTH}] -z-10`}
      />
      <SidebarInset className="overflow-hidden">
        <main className="h-svh flex-col flex-wrap">
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
