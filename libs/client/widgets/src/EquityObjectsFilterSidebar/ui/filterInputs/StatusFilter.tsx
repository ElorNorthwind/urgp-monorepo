import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { caseStatusStyles, useCaseStatusTypes } from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { CaseRoutes, cn } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';

type StatusFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const StatusFilter = (props: StatusFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'status',
  } = props;
  const pathname = useLocation().pathname as CaseRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;
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
