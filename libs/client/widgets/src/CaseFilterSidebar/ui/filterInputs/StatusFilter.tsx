import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  caseStatusStyles,
  caseTypeStyles,
  useCaseStatusTypes,
  useCaseTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';

type StatusFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
  route?: '/control/cases' | '/control/settings/filter';
};

const StatusFilter = (props: StatusFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'status',
    route = '/control/cases',
  } = props;

  const navigate = useNavigate({ from: route });
  const search = getRouteApi(route).useSearch() as CasesPageSearchDto;
  const { data, isLoading, isFetching } = useCaseStatusTypes();

  return (
    <ClassificatorFilter
      accordionItemValue={accordionItemValue}
      label="Статусы"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      valueStyles={caseStatusStyles}
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

export { StatusFilter };
