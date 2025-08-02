import { getRouteApi, useLocation } from '@tanstack/react-router';
import { Row } from '@tanstack/react-table';
import {
  formatEquityObjectRowForExcel,
  formatVksCaseRowForExcel,
} from '@urgp/client/entities';
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
  cn,
  EquityRoutes,
  Separator,
  SidebarTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import {
  EquityApartmentNumberFilter,
  EquityQueryFilter,
  EquityResetFilter,
  VksCasesQueryFilter,
} from '@urgp/client/widgets';
import {
  EquityObject,
  EquityObjectsPageSearch,
  VksCaseSlim,
  VksCasesPageSearch,
} from '@urgp/shared/entities';
import { useMemo } from 'react';
type VksCasesPageHeaderProps = {
  total?: number;
  filtered?: number;
  className?: string;
  exportedRows?: Row<VksCaseSlim>[];
};

const VksCasesPageHeader = (props: VksCasesPageHeaderProps): JSX.Element => {
  const { total, filtered, className, exportedRows } = props;
  const isMobile = useIsMobile();
  const pathname = useLocation().pathname as EquityRoutes;
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;
  const paramLength = Object.keys(search).filter(
    (key) =>
      !['selectedCase', 'dateFrom', 'dateTo', 'sortKey', 'sortDir'].includes(
        key,
      ),
  ).length;

  const exportedData = useMemo(() => {
    if (exportedRows) {
      return exportedRows?.map((r) => formatVksCaseRowForExcel(r));
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
      {!search?.selectedCase && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 hidden h-4 shrink-0 lg:block"
          />
          <Breadcrumb className="hidden shrink-0 lg:block">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/vks">Онлайн-консультации</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{'Список'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}

      {!isMobile && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 hidden h-4 shrink-0 lg:block"
          />
          <div className="text-muted-foreground hidden shrink-0 lg:block">
            {filtered || 0} из {total || 0}
          </div>
        </>
      )}

      {!isMobile && (
        <VksCasesQueryFilter className="ml-auto h-8 w-48 transition-all duration-200 ease-linear focus-within:w-full" />
      )}

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

export { VksCasesPageHeader };
