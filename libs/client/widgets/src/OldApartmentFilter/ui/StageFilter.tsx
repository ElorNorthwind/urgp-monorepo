import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  caseStatusStyles,
  useApartmentStageClassificator,
  useCaseStatusTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { CaseRoutes, cn } from '@urgp/client/shared';
import { CasesPageSearchDto, OldApartmentSearch } from '@urgp/shared/entities';

type OldApartmentStageFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
  filters: OldApartmentSearch;
  setFilters: (value: Partial<OldApartmentSearch>) => void;
};

const OldApartmentStageFilter = (
  props: OldApartmentStageFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'popover',
    accordionItemValue = 'stage',
    filters,
    setFilters,
  } = props;
  const { data, isLoading, isFetching } = useApartmentStageClassificator();

  return (
    <ClassificatorFilter
      label="Этапы работы"
      className={cn('', className)}
      popoverClassName="max-h-96 w-96"
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      // valueStyles={caseStatusStyles}
      selectedValues={filters.stage}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        setFilters({
          stage: values.length > 0 ? values : undefined,
        })
      }
    />
  );
};

export { OldApartmentStageFilter };
