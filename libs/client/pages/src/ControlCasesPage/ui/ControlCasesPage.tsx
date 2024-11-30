import {
  unansweredMessagesColumns,
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
  SidebarInset,
  SidebarTrigger,
  useSidebar,
  VirtualDataTable,
} from '@urgp/client/shared';
import { ControlSidebar } from '@urgp/client/widgets';
import { Drama } from 'lucide-react';

const ControlCasesPage = (): JSX.Element => {
  const {
    data: messages,
    isLoading,
    isFetching,
  } = useUnansweredMessages('all');

  const { toggleSidebar } = useSidebar();

  return (
    <>
      <SidebarInset className="overflow-hidden">
        <main className="h-svh flex-col flex-wrap p-0">
          {/* <div className="h-11 w-full border-b p-2">
            <SidebarTrigger />
          </div> */}
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            {/* <SidebarTrigger className="-ml-1" /> */}
            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className="size-8 -ml-1 p-0"
            >
              <Drama />
            </Button>
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
            columns={unansweredMessagesColumns}
            data={messages || []}
            isFetching={isLoading || isFetching}
            totalCount={messages?.length ?? 0}
            enableMultiRowSelection={false}
            variant="borderless"
          />
        </main>
      </SidebarInset>
      <ControlSidebar side="right" />
    </>
  );
};

export { ControlCasesPage };
