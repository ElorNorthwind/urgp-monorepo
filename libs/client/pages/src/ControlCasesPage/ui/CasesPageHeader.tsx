import { getRouteApi, useLocation } from '@tanstack/react-router';
import { Row } from '@tanstack/react-table';
import {
  CreateCaseButton,
  formatCaseRowForExcel,
  useCases,
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
  CaseRoutes,
  cn,
  Separator,
  SidebarTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { QueryFilter, ResetFilter, UserFilter } from '@urgp/client/widgets';
import { CaseFull, CasesPageSearchDto } from '@urgp/shared/entities';
import { useEffect, useMemo } from 'react';
type CasePageHeaderProps = {
  total?: number;
  filtered?: number;
  className?: string;
  exportedRows?: Row<CaseFull>[];
  // columnVisibility?: VisibilityState;
  // setColumnVisibility?: Dispatch<VisibilityState>;
};

const CasesPageHeader = (props: CasePageHeaderProps): JSX.Element => {
  const { total, filtered, className, exportedRows } = props;
  const isMobile = useIsMobile();
  const pathname = useLocation().pathname as CaseRoutes;
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;
  const paramLength = Object.keys(search).filter(
    (key) => !['selectedCase', 'sortKey', 'sortDir'].includes(key),
  ).length;

  const exportedData = useMemo(() => {
    if (exportedRows) {
      return exportedRows?.map((r) => formatCaseRowForExcel(r));
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
      <UserFilter variant="mini" />
      <ResetFilter variant="mini" className="" />
      <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
      <Breadcrumb className="shrink-0">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/control">ИС Кон(троль)</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {pathname === '/control/cases' ? 'Дела' : 'Ожидают решения'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {!isMobile && (
        <>
          <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />
          <div className="text-muted-foreground mr-4 shrink-0">
            {filtered || 0} из {total || 0}
          </div>
        </>
      )}

      {!isMobile && (
        <QueryFilter className="ml-auto h-8 w-48 transition-all duration-200 ease-linear focus-within:w-full" />
      )}
      {!isMobile && exportedRows && (
        <ExportToExcelButton
          data={exportedData}
          size="icon"
          className="size-8 p-0"
          fileName="Заявки"
        />
      )}
      {pathname === '/control/cases' && (
        <CreateCaseButton className={isMobile ? 'ml-auto' : ''} />
      )}
      <ColumnVisibilitySelector />
    </header>
  );
};

export { CasesPageHeader };
