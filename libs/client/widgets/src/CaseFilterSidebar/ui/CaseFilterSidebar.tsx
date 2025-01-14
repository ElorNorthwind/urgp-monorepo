import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  useCaseDirectionTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import {
  Accordion,
  cn,
  Input,
  ScrollArea,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { Search } from 'lucide-react';
import { QueryFilter } from './filterInputs/QueryFilter';
import { DirectionsFilter } from './filterInputs/DirectionsFilter';
import { CaseTypesFilter } from './filterInputs/CaseTypesFilter';
import { StatusFilter } from './filterInputs/StatusFilter';
import { ResetFilter } from './filterInputs/ResetFilter';
import { DepartmentsFilter } from './filterInputs/DepartmentsFilter';
import { NumberFilter } from './filterInputs/NumberFilter';
import { ViewStatusFilter } from './filterInputs/ViewStatusFilter';
import { DueDateFilter } from './filterInputs/DueDateFilter';

type ControlSidebarProps = {
  side?: 'left' | 'right';
  className?: string;
};

const CaseFilterSidebar = (props: ControlSidebarProps): JSX.Element => {
  const { side = 'left', className } = props;
  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      side={side}
      className={className}
    >
      <SidebarHeader className="bg-muted-foreground/5">
        <SidebarMenu>
          <SidebarMenuItem className="text-foreground text-center  text-lg">
            Фильтр таблицы дел
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className={cn('h-full')}>
          <div className="m-3 flex h-full flex-col gap-2">
            <QueryFilter className="h-8 flex-shrink-0" />
            <NumberFilter className="h-8 flex-shrink-0" />
            <DueDateFilter className="flex-shrink-0" />
            <Accordion type="multiple" defaultValue={['departments']}>
              <DepartmentsFilter variant="accordion" />
              <StatusFilter variant="accordion" />
              <DirectionsFilter variant="accordion" />
              <CaseTypesFilter variant="accordion" />
              <ViewStatusFilter variant="accordion" />
            </Accordion>
          </div>
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

export { CaseFilterSidebar };
