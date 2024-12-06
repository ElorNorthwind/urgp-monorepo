import { CaseCard, controlCasesColumns, useCases } from '@urgp/client/entities';
import {
  cn,
  NAVBAR_WIDTH,
  SidebarInset,
  TooltipProvider,
  useIsMobile,
  VirtualDataTable,
} from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { CaseFilterSidebar, ControlSidePanel } from '@urgp/client/widgets';
import { CasesPageHeader } from './CasesPageHeader';

const ControlCasesPage = (): JSX.Element => {
  const { data: cases, isLoading, isFetching } = useCases();
  const isMobile = useIsMobile();
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
          <CasesPageHeader />
          <VirtualDataTable
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
      <ControlSidePanel
        isOpen={search.selectedCase !== undefined}
        onClose={() =>
          navigate({
            search: (prev: CasesPageSearchDto) => ({
              ...prev,
              selectedCase: undefined,
            }),
          })
        }
      >
        <CaseCard
          controlCase={cases?.find((c) => c.id === search.selectedCase)!}
        />
      </ControlSidePanel>
    </TooltipProvider>
  );
};

export { ControlCasesPage };
