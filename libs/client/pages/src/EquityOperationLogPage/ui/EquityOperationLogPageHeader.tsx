import { getRouteApi, useLocation } from '@tanstack/react-router';
import { Row } from '@tanstack/react-table';
import { formatEquityOperationLogRowForExcel } from '@urgp/client/entities';
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
  EquityOperationDateFilter,
  EquityQueryFilter,
  EquityResetFilter,
} from '@urgp/client/widgets';
import {
  EquityOperationLogItem,
  EquityOperationLogPageSearch,
} from '@urgp/shared/entities';
import { useMemo } from 'react';
type EquityOperationLogPageHeaderProps = {
  total?: number;
  filtered?: number;
  className?: string;
  exportedRows?: Row<EquityOperationLogItem>[];
};

const EquityOperationLogPageHeader = (
  props: EquityOperationLogPageHeaderProps,
): JSX.Element => {
  const { total, filtered, className, exportedRows } = props;
  const isMobile = useIsMobile();
  const pathname = useLocation().pathname as EquityRoutes;
  const search = getRouteApi(
    pathname,
  ).useSearch() as EquityOperationLogPageSearch;
  const paramLength = Object.keys(search).filter(
    (key) => !['selectedObject', 'sortKey', 'sortDir'].includes(key),
  ).length;

  const exportedData = useMemo(() => {
    if (exportedRows) {
      return exportedRows?.map((r) => formatEquityOperationLogRowForExcel(r));
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
      <EquityResetFilter variant="mini" className="" />
      {!search?.selectedObject && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 hidden h-4 shrink-0 lg:block"
          />
          <Breadcrumb className="hidden shrink-0 lg:block">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/equity">Дольщики</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{'Журнал операций'}</BreadcrumbPage>
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
        <EquityQueryFilter className="ml-auto h-8 w-48 transition-all duration-200 ease-linear focus-within:w-full" />
      )}
      {!isMobile && <EquityOperationDateFilter />}

      {!isMobile && exportedRows && (
        <ExportToExcelButton
          data={exportedData}
          size="icon"
          className="size-8 p-0"
          fileName="Операции"
        />
      )}
      <ColumnVisibilitySelector />
    </header>
  );
};

export { EquityOperationLogPageHeader };
