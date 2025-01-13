import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { CreateCaseDialog, CreateStageForm } from '@urgp/client/entities';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  cn,
  Input,
  Separator,
  SidebarTrigger,
  useIsMobile,
  useUserAbility,
} from '@urgp/client/shared';
import { QueryFilter, ResetFilter } from '@urgp/client/widgets';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { Settings2 } from 'lucide-react';
type CasePageHeaderProps = {
  total?: number;
  filtered?: number;
  className?: string;
};

const CasesPageHeader = (props: CasePageHeaderProps): JSX.Element => {
  const { total, filtered, className } = props;
  const isMobile = useIsMobile();
  const i = useUserAbility();

  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;
  const paramLength = Object.keys(search).filter(
    (key) => !['selectedCase'].includes(key),
  ).length;

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
      <ResetFilter variant="mini" className="" />
      <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
      <Breadcrumb className="shrink-0">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/control">ИС Кон(троль)</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Дела</BreadcrumbPage>
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

      <QueryFilter className="ml-auto h-8 w-48 transition-all duration-200 ease-linear focus-within:w-full" />
      {i.can('create', 'Case') && <CreateCaseDialog />}
      <Button variant={'outline'} className="size-8 shrink-0 p-1">
        <Settings2 className="size-4" />
      </Button>
    </header>
  );
};

export { CasesPageHeader };
