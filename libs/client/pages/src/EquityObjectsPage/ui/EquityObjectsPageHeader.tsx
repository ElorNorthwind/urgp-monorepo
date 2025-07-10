import { getRouteApi, useLocation } from '@tanstack/react-router';
import { Row } from '@tanstack/react-table';
import { formatEquityObjectRowForExcel } from '@urgp/client/entities';
import {
  ColumnVisibilitySelector,
  ExportToExcelButton,
} from '@urgp/client/features';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  CaseRoutes,
  cn,
  Separator,
  SidebarTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import {
  EquityApartmentNumberFilter,
  EquityBuildingsFilter,
  EquityObjectTypeFilter,
  EquityQueryFilter,
  EquityResetFilter,
  QueryFilter,
  ResetFilter,
} from '@urgp/client/widgets';
import { CasesPageSearchDto, EquityObject } from '@urgp/shared/entities';
import { useMemo } from 'react';
type CasePageHeaderProps = {
  total?: number;
  filtered?: number;
  className?: string;
  exportedRows?: Row<EquityObject>[];
  // columnVisibility?: VisibilityState;
  // setColumnVisibility?: Dispatch<VisibilityState>;
};

const EquityObjectsPageHeader = (props: CasePageHeaderProps): JSX.Element => {
  const { total, filtered, className, exportedRows } = props;
  const isMobile = useIsMobile();
  const pathname = useLocation().pathname as CaseRoutes;
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;
  const paramLength = Object.keys(search).filter(
    (key) => !['selectedObject', 'sortKey', 'sortDir'].includes(key),
  ).length;

  const exportedData = useMemo(() => {
    if (exportedRows) {
      return exportedRows?.map((r) => formatEquityObjectRowForExcel(r));
    } else return [];
  }, [exportedRows]);

  return (
    <header
      className={cn(
        'relative flex h-12 w-full shrink-0 items-center gap-2 border-b px-3',
        className,
      )}
    >
      <SidebarTrigger className="shrink-0" />
      {!!paramLength && (
        <div className="bg-foreground text-background pointer-events-none absolute left-7 top-6 size-4 rounded-full p-0 text-center text-xs">
          {paramLength}
        </div>
      )}
      {/* <UserFilter variant="mini" /> */}
      <EquityResetFilter variant="mini" className="" />
      <Separator
        orientation="vertical"
        className="mr-2 hidden h-4 shrink-0 lg:block"
      />
      <Breadcrumb className="hidden shrink-0 lg:block">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/equity">Дольщики</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{'Объекты'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {!isMobile && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 hidden h-4 shrink-0 lg:block"
          />
          <div className="text-muted-foreground mr-4 hidden shrink-0 lg:block">
            {filtered || 0} из {total || 0}
          </div>
        </>
      )}

      {!isMobile && (
        <EquityQueryFilter className="ml-auto h-8 w-48 transition-all duration-200 ease-linear focus-within:w-full" />
      )}

      {!isMobile && <EquityApartmentNumberFilter className="h-8 w-20" />}

      {!isMobile && exportedRows && (
        <ExportToExcelButton
          data={exportedData}
          size="icon"
          className="size-8 p-0"
          fileName="Объекты"
        />
      )}

      <ColumnVisibilitySelector />
    </header>
  );
};

export { EquityObjectsPageHeader };
