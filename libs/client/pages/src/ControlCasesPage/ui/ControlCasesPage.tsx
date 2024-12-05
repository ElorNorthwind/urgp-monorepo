import { controlCasesColumns, useCases } from '@urgp/client/entities';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  cn,
  Separator,
  SidebarInset,
  SidebarTrigger,
  TooltipProvider,
  useIsMobile,
  VirtualDataTable,
} from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  CaseFilterSidebar,
  ControlSidePanel,
  NAVBAR_WIDTH,
} from '@urgp/client/widgets';
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
              selectedCase: search.selectedCase === undefined,
            }),
          })
        }
      >
        Бла бла бла
      </ControlSidePanel>
      {/* <div
        className={cn(
          'bg-sidebar text-sidebar-foreground h-svh transform overflow-hidden border-l p-4 duration-200 ease-linear',
          search?.selectedCase
            ? isMobile
              ? 'w-full'
              : ' w-[--sidebar-width]'
            : 'm-0 w-0 p-0',
        )}
      >
        Блах блах блах
        <Button
          variant="ghost"
          onClick={() =>
            navigate({
              search: (prev: CasesPageSearchDto) => ({
                ...prev,
                selectedCase: search.selectedCase === undefined,
              }),
            })
          }
        >
          <X />
        </Button>
      </div> */}
    </TooltipProvider>
  );
};

export { ControlCasesPage };
