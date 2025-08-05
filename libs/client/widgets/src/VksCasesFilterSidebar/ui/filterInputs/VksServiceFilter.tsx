import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  useVksDepartmentClassificator,
  useVksServiceTypesClassificator,
  vksDepartmentStyles,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import { VksCasesPageSearch } from '@urgp/shared/entities';

type VksServiceFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const VksServiceFilter = (props: VksServiceFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'service',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;
  const { data, isLoading, isFetching } = useVksServiceTypesClassificator();

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Типы услуг"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      categoryStyles={vksDepartmentStyles}
      selectedValues={search.service}
      iconClassName="size-4"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            service: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { VksServiceFilter };
