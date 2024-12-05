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
  useSidebar,
  VirtualDataTable,
} from '@urgp/client/shared';
// import { ControlSidebar } from '@urgp/client/widgets';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { CaseFilterSidebar } from '@urgp/client/widgets';

const ControlCasesPage = (): JSX.Element => {
  const { data: cases, isLoading, isFetching } = useCases();
  const isMobile = useIsMobile();
  const navigate = useNavigate({ from: '/control' });
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;
  //  className="left-[--navbar-width]"
  return (
    <TooltipProvider delayDuration={50}>
      <CaseFilterSidebar
        side="left"
        // className="left-[--navbar-width]"
        // className="left-[--navbar-width] group-data-[collapsible=offcanvas]:left-[calc((var(--sidebar-width)*-1))]"
        // className="left-[--navbar-width]"
        // className="w-[calc(var(--navbar-width)+var(--sidebar-width)] pl-[--navbar-width]"
      />
      <SidebarInset className="overflow-hidden">
        <main className="h-svh flex-col flex-wrap">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/control">ИС Кон(троль)</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Дела</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
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
      <div
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
      </div>
    </TooltipProvider>
  );
};

export { ControlCasesPage };
