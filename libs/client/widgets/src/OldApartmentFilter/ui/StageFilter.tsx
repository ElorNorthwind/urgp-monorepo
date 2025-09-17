import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  caseStatusStyles,
  useApartmentStageClassificator,
  useCaseStatusTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { CaseRoutes, cn } from '@urgp/client/shared';
import {
  CasesPageSearchDto,
  OldApartmentSearch,
  OldAppartment,
} from '@urgp/shared/entities';

type OldApartmentStageFilterProps = {
  apartments: OldAppartment[] | undefined;
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
    apartments,
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
      popoverClassName="w-96"
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      // countValue={(value) =>
      //   apartments?.filter((a) => a?.classificator?.stageId === value).length ||
      //   0
      // }
      // valueStyles={caseStatusStyles}
      selectedValues={filters.stage}
      iconClassName="size-5"
      setSelectedValues={(values) =>
        setFilters({
          stage: values.length > 0 ? values : undefined,
        })
      }
    />
  );
};

export { OldApartmentStageFilter };
