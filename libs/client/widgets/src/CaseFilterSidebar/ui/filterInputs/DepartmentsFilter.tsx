import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  caseTypeStyles,
  directionCategoryStyles,
  useCaseTypes,
  useDepartmentTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';

type DepartmentsFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const DepartmentsFilter = (props: DepartmentsFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'departments',
  } = props;

  const navigate = useNavigate({ from: '/control' });
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;
  const { data, isLoading, isFetching } = useDepartmentTypes();

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Управления"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      valueStyles={directionCategoryStyles}
      selectedValues={search.department}
      iconClassName="size-3"
      shortBadge
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

export { DepartmentsFilter };
