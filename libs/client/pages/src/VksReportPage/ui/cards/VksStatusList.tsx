import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { useVksStatusStats, vksCaseStatusStyles } from '@urgp/client/entities';
import { SimpleBarChart } from '@urgp/client/features';
import { Card, CardContent, cn, useVksAbility } from '@urgp/client/shared';
import { VksDashbordPageSearch } from '@urgp/shared/entities';
import { format, subDays } from 'date-fns';
import { Circle } from 'lucide-react';

type VksStatusListProps = {
  className?: string;
};

const VksStatusList = ({ className }: VksStatusListProps): JSX.Element => {
  const pathname = useLocation().pathname;
  const search = getRouteApi(pathname).useSearch() as VksDashbordPageSearch;
  const navigate = useNavigate({ from: pathname });
  const i = useVksAbility();
  const datedSearch = {
    dateFrom: search?.dateFrom || format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    dateTo: search?.dateTo || format(new Date(), 'yyyy-MM-dd'),
    department: search?.department,
  };
  const { data, isLoading, isFetching } = useVksStatusStats(datedSearch);

  const values =
    data?.map((d) => ({
      key: d.status,
      value: d.count,
      label: d.status,
      icon:
        vksCaseStatusStyles[d.status as keyof typeof vksCaseStatusStyles]
          ?.icon || Circle,
      iconStyle:
        vksCaseStatusStyles[d.status as keyof typeof vksCaseStatusStyles]
          ?.iconStyle || '',
    })) || [];
  // vksCaseStatusStyles;

  return (
    <Card className={cn('p-4', className)}>
      <SimpleBarChart
        values={values.sort((a, b) => b.value - a.value)}
        labelFit="full"
        extraBarClass={(d) => cn('bg-muted-foreground/10', d.iconStyle)}
        onBarClick={(key) => {
          navigate({
            to: '/vks/cases',
            search: {
              status: key,
              dateFrom: search.dateFrom,
              dateTo: search.dateTo,
              department: search.department,
            },
          });
        }}
      />
    </Card>
  );
};

export { VksStatusList };
