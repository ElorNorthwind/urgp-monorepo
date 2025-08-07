import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  useVksDepartmentClassificator,
  vksDepartmentStyles,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import { VksCasesPageSearch } from '@urgp/shared/entities';

type VksDepartmentFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
  overrideDefaultWidth?: boolean;
  fullBadge?: boolean;
};

const VksDepartmentFilter = (props: VksDepartmentFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'department',
    overrideDefaultWidth = false,
    fullBadge = false,
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;
  const { data, isLoading, isFetching } = useVksDepartmentClassificator();

  return (
    <ClassificatorFilter<number>
      accordionItemValue={accordionItemValue}
      label="Подразделения"
      className={cn(overrideDefaultWidth ? '' : 'w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      valueStyles={vksDepartmentStyles}
      selectedValues={search.department}
      iconClassName="size-4"
      shortBadge={!fullBadge}
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            department: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { VksDepartmentFilter };
