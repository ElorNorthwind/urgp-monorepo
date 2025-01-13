import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  useCaseDirectionTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import {
  Button,
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

type ControlSidebarProps = {
  side?: 'left' | 'right';
  className?: string;
};

const CaseFilterSidebar = (props: ControlSidebarProps): JSX.Element => {
  const { side = 'left', className } = props;

  const navigate = useNavigate({ from: '/control' });
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;
  const {
    data: directionTypes,
    isLoading,
    isFetching,
  } = useCaseDirectionTypes();

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      side={side}
      className={className}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>Фильтр дел</SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Условия поиска</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ClassificatorFilter
                label="Направления"
                triggerClassName="w-full"
                disabled={isLoading || isFetching}
                isLoading={isLoading || isFetching}
                options={directionTypes || []}
                categoryStyles={directionCategoryStyles}
                selectedValues={search.direction}
                setSelectedValues={(directions) =>
                  navigate({
                    search: {
                      ...search,
                      direction: directions.length > 0 ? directions : undefined,
                    },
                  })
                }
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export { CaseFilterSidebar };
