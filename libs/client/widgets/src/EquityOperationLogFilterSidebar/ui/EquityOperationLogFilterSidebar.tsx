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
import { useLocation } from '@tanstack/react-router';
import {
  EquityBuildingsFilter,
  EquityClaimTransferFilter,
  EquityObjectProblemsFilter,
  EquityObjectStatusFilter,
  EquityObjectTypeFilter,
  EquityQueryFilter,
  EquityResetFilter,
} from '../../EquityObjectsFilterSidebar';
import { EquityOperationTypeFilter } from './filterInputs/EquityOperationTypeFilter';
import { EquityOperationDateFilter } from './filterInputs/EquityOperationDateFilter';
import { EquityObjectDocumentsFilter } from '../../EquityObjectsFilterSidebar/ui/filterInputs/EquityObjectDocumentsFilter';
import { EquityOpinionUrgpFilter } from '../../EquityObjectsFilterSidebar/ui/filterInputs/EquityOpinionUrgpFilter';

type EquityOperationLogFilterSidebarProps = {
  side?: 'left' | 'right';
  className?: string;
};

const EquityOperationLogFilterSidebar = (
  props: EquityOperationLogFilterSidebarProps,
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
            <div>Фильтр журнала операций</div>
            <ChevronLeft className="size-5 opacity-0 transition-opacity duration-200 group-hover/header:opacity-100" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className={cn('h-full')}>
          <div className="m-3 flex h-full flex-col gap-2">
            <EquityQueryFilter className="h-8 flex-shrink-0" />
            <EquityOperationDateFilter className="h-8 flex-shrink-0" />
            <Accordion type="multiple" defaultValue={['optype']}>
              <EquityOperationTypeFilter variant="accordion" />
              <EquityObjectStatusFilter variant="accordion" />
              <EquityObjectTypeFilter variant="accordion" />
              <EquityObjectProblemsFilter variant="accordion" />
              <EquityBuildingsFilter variant="accordion" />
              <EquityObjectDocumentsFilter variant="accordion" />
              <EquityClaimTransferFilter variant="accordion" />
              <EquityOpinionUrgpFilter variant="accordion" />
            </Accordion>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <EquityResetFilter className="w-full" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export { EquityOperationLogFilterSidebar };
