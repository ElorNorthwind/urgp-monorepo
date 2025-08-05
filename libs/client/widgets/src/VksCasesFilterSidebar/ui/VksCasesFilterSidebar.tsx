import { useLocation } from '@tanstack/react-router';
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
import { VksCasesQueryFilter } from './filterInputs/VksCasesQueryFilter';
import { VksCasesResetFilter } from './filterInputs/VksCasesResetFilter';
import { VksCasesDateFilter } from './filterInputs/VksCasesDateFilter';
import { VksCaseStatusFilter } from './filterInputs/VksCaseStatusFilter';
import { VksDepartmentFilter } from './filterInputs/VksDepartmentFilter';
import { VksServiceFilter } from './filterInputs/VksServiceFilter';

type VksCasesFilterSidebarProps = {
  side?: 'left' | 'right';
  className?: string;
};

const VksCasesFilterSidebar = (
  props: VksCasesFilterSidebarProps,
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
            <div>Фильтр консультаций</div>
            <ChevronLeft className="size-5 opacity-0 transition-opacity duration-200 group-hover/header:opacity-100" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className={cn('h-full')}>
          <div className="flex h-full flex-col gap-2 p-2">
            <VksCasesQueryFilter className="h-8 flex-shrink-0" />
            <VksCasesDateFilter className="h-8 flex-shrink-0" />
            <Accordion type="multiple" defaultValue={['status', 'department']}>
              <VksCaseStatusFilter variant="accordion" />
              <VksDepartmentFilter variant="accordion" />
              <VksServiceFilter variant="accordion" />
            </Accordion>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <VksCasesResetFilter className="w-full" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export { VksCasesFilterSidebar };
