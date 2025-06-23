import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { caseTypeStyles, useCaseTypes } from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { CaseRoutes, cn } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';

type CaseTypesFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const CaseTypesFilter = (props: CaseTypesFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'caseTypes',
  } = props;
  const pathname = useLocation().pathname as CaseRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;
  const { data, isLoading, isFetching } = useCaseTypes();

  return (
    <ClassificatorFilter
      accordionItemValue={accordionItemValue}
      label="Типы дел"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      valueStyles={caseTypeStyles}
      selectedValues={search.type}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            type: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { CaseTypesFilter };
