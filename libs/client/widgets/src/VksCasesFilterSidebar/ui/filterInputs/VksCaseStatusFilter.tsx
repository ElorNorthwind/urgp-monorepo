import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  equityObjectStatusStyles,
  useEquityObjectStatus,
  useVksStatusClassificator,
  vksCaseStatusStyles,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import {
  EquityObjectsPageSearch,
  VksCasesPageSearch,
} from '@urgp/shared/entities';

type VksCaseStatusFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const VksCaseStatusFilter = (props: VksCaseStatusFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'status',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;
  const { data, isLoading, isFetching } = useVksStatusClassificator();

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Статусы"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      valueStyles={vksCaseStatusStyles}
      selectedValues={search.status}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            status: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { VksCaseStatusFilter };
