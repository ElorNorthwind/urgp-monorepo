import {
  controlCasesColumns,
  unansweredMessagesColumns,
  useCases,
  useUnansweredMessages,
} from '@urgp/client/entities';
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
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  TooltipProvider,
  useIsMobile,
  useSidebar,
  VirtualDataTable,
} from '@urgp/client/shared';
import { ControlSidebar } from '@urgp/client/widgets';
import { Case, CaseWithStatus } from '@urgp/shared/entities';
import { Cross, Drama, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ColumnDefBase } from '@tanstack/react-table';

const ControlCasesPage = (): JSX.Element => {
  const { data: cases, isLoading, isFetching } = useCases();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <TooltipProvider delayDuration={50}>
      <ControlSidebar side="left" className="left-[--navbar-width]" />
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
            <Button onClick={() => setOpen((prev) => !prev)}>{'>>'}</Button>
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
            // onRowClick={() => console.log('click')}
          />
        </main>
      </SidebarInset>
      <div
        className={cn(
          'bg-sidebar text-sidebar-foreground h-svh transform overflow-hidden border-l p-4 duration-200 ease-linear',
          open ? (isMobile ? 'w-full' : ' w-[--sidebar-width]') : 'm-0 w-0 p-0',
        )}
      >
        Блах блах блах
        <Button variant="ghost" onClick={() => setOpen(false)}>
          <X />
        </Button>
      </div>
    </TooltipProvider>
  );
};

type TestProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ControlledSidebar = (props: TestProps): JSX.Element => {
  // this is a bit cursed, but hey, it works...
  const { openMobile, setOpenMobile } = useSidebar();
  useEffect(() => {
    setOpenMobile(props.open);
  }, [props.open]);
  useEffect(() => {
    props.setOpen(openMobile);
  }, [openMobile]);

  return <ControlSidebar side="right" />;
};

export { ControlCasesPage };
