import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  useCaseDirectionTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import {
  Accordion,
  Input,
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
import { ScrollArea } from '@radix-ui/react-scroll-area';

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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <QueryFilter className="h-8" />
              <NumberFilter className="h-8" />
              <Accordion type="multiple" defaultValue={['departments']}>
                <DepartmentsFilter variant="accordion" />
                <StatusFilter variant="accordion" />
                <DirectionsFilter variant="accordion" />
                <CaseTypesFilter variant="accordion" />
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
