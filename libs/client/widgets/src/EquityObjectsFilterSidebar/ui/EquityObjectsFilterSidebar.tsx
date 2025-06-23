import {
  Accordion,
  cn,
  ScrollArea,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@urgp/client/shared';
import { ChevronLeft } from 'lucide-react';
import { CaseTypesFilter } from './filterInputs/CaseTypesFilter';
import { DepartmentsFilter } from './filterInputs/DepartmentsFilter';
import { DirectionsFilter } from './filterInputs/DirectionsFilter';
import { DueDateFilter } from './filterInputs/DueDateFilter';
import { NumberFilter } from './filterInputs/NumberFilter';
import { QueryFilter } from './filterInputs/QueryFilter';
import { ResetFilter } from './filterInputs/ResetFilter';
import { StatusFilter } from './filterInputs/StatusFilter';
import { ViewStatusFilter } from './filterInputs/ViewStatusFilter';
import { AuthorFilter } from './filterInputs/AuthorFilter';
import { RelevantFilter } from './filterInputs/RelevantFilter';
import { useLocation } from '@tanstack/react-router';
import { PendingActionChart } from 'libs/client/pages/src/ControlDashboardPage/ui/cards/PendingActionsChart';
import { PendingActionsFilter } from './filterInputs/PendingActionsFilter';
import { ControlToMeFilter } from './filterInputs/ControlToMeFilter';
import { FromMeFilter } from './filterInputs/FromMeFilter';

type EquityObjectsFilterSidebarProps = {
  side?: 'left' | 'right';
  className?: string;
};

const EquityObjectsFilterSidebar = (
  props: EquityObjectsFilterSidebarProps,
): JSX.Element => {
  const { pathname } = useLocation();
  const { side = 'left', className } = props;
  const { setOpen } = useSidebar();
  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      side={side}
      className={className}
    >
      <SidebarHeader className="bg-muted-foreground/5">
        <SidebarMenu>
          <SidebarMenuItem
            className="text-foreground group/header flex cursor-pointer flex-row items-center justify-center gap-1 text-center text-lg"
            onClick={() => setOpen(false)}
          >
            <div>Фильтр таблицы объектов</div>
            <ChevronLeft className="size-5 opacity-0 transition-opacity duration-200 group-hover/header:opacity-100" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className={cn('h-full')}>
          {/* <div className="m-3 flex h-full flex-col gap-2">
            <QueryFilter className="h-8 flex-shrink-0" />
            {pathname !== '/control/problems' && (
              <NumberFilter className="h-8 flex-shrink-0" />
            )}
            <AuthorFilter className="h-8 flex-shrink-0" />
            <DueDateFilter className="flex-shrink-0" />
            <RelevantFilter className="h-8 flex-shrink-0" />
            <FromMeFilter className="h-8 flex-shrink-0" />
            <Accordion
              type="multiple"
              defaultValue={
                pathname === '/control/pending' ? ['action'] : ['departments']
              }
            >
              <DepartmentsFilter variant="accordion" />
              <ControlToMeFilter variant="accordion" />
              <PendingActionsFilter variant="accordion" />
              <StatusFilter variant="accordion" />
              <DirectionsFilter variant="accordion" />
              {pathname !== '/control/problems' && (
                <CaseTypesFilter variant="accordion" />
              )}
              <ViewStatusFilter variant="accordion" />
            </Accordion>
          </div> */}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <ResetFilter className="w-full" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export { EquityObjectsFilterSidebar };
