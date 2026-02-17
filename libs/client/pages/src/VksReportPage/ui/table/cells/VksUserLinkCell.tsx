import { getRouteApi, useLocation } from '@tanstack/react-router';
import { CellContext } from '@tanstack/react-table';
import { buttonVariants, cn } from '@urgp/client/shared';
import { VksDashbordPageSearch, VksUserStats } from '@urgp/shared/entities';
import { Link } from '@tanstack/react-router';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
function VksUserLinkCell(
  props: CellContext<VksUserStats, unknown>,
): JSX.Element {
  const rowData = props.row?.original;
  const pathname = useLocation().pathname;
  const search = getRouteApi(pathname).useSearch() as VksDashbordPageSearch;
  const baseUrl = '/vks/cases';
  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'text-primary group -my-2 -ml-2 flex h-9 gap-2 px-2',
      )}
      to={baseUrl}
      search={{
        operator:
          rowData?.operator && rowData?.operator !== 'Не заполнена анкета'
            ? rowData?.operator
            : undefined,
        status: ['обслужен', 'не явился по вызову'],
        dateFrom: search?.dateFrom,
        dateTo: search?.dateTo,
        department: search?.department,
        operatorSurvey:
          rowData?.operator === 'Не заполнена анкета' ? [0] : undefined,
      }}
    >
      <span>{rowData?.operator}</span>
      <ExternalLink className="text-muted-foreground/30 group-hover:text-primary size-5 flex-shrink-0" />
    </Link>
  );
}

export { VksUserLinkCell };
