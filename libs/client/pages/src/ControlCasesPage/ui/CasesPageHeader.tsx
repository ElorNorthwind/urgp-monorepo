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
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { Search, Settings2, SquarePlus } from 'lucide-react';
type CasePageHeaderProps = {
  total?: number;
  filtered?: number;
  className?: string;
};

const CasesPageHeader = (props: CasePageHeaderProps): JSX.Element => {
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;
  const navigate = useNavigate({ from: '/control' });
  const { total, filtered, className } = props;
  const isMobile = useIsMobile();
  const i = useUserAbility();

  return (
    <header
      className={cn(
        'flex h-12 w-full shrink-0 items-center gap-2 border-b px-3',
        className,
      )}
    >
      <SidebarTrigger className="shrink-0" />
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
      <Input
        type="search"
        placeholder="Поиск..."
        leading={<Search className="size-4" />}
        className="ml-auto h-8 w-48 transition-all duration-200 ease-linear focus-within:w-full"
        value={search?.query || ''}
        onChange={(event) =>
          navigate({
            search: (prev: CasesPageSearchDto) => ({
              ...prev,
              query:
                event.target.value && event.target.value.length > 0
                  ? event.target.value
                  : undefined,
            }),
          })
        }
      />
      {i.can('create', 'Case') && <CreateCaseDialog />}
      <Button variant={'outline'} className="size-8 shrink-0 p-1">
        <Settings2 className="size-4" />
      </Button>
    </header>
  );
};

export { CasesPageHeader };
