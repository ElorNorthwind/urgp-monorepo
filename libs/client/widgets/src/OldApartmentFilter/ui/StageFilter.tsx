import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  caseStatusStyles,
  oldApartmentsFilterFn,
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
import { Row } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

type OldApartmentStageFilterProps = {
  apartments: Row<OldAppartment>[] | undefined;
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
  filters: OldApartmentSearch;
  validFilters: OldApartmentSearch;
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
    validFilters,
  } = props;
  const { data, isLoading, isFetching } = useApartmentStageClassificator();
  const navigate = useNavigate({ from: '/renovation/oldapartments' });

  const countValues = (value: number, rows: Row<OldAppartment>[]) =>
    rows?.filter((a) => a?.original?.classificator?.stageId === value).length ||
    0;

  const countedData = useMemo(() => {
    if (!data) return null;
    const filteredRows =
      apartments?.filter((row) =>
        oldApartmentsFilterFn(row, '', validFilters),
      ) || [];

    // console.log('recalc!');
    return data
      .map((option) => ({
        ...option,
        items: option.items
          .map((item) => ({
            ...item,
            count: countValues(item.value, filteredRows),
          }))
          .filter((item) => (item.count || 0) > 0),
      }))
      .filter((option) => option.items.some((item) => (item.count || 0) > 0));
  }, [validFilters]);

  return (
    <ClassificatorFilter
      label="Этапы работы"
      className={cn('', className)}
      popoverClassName="w-96"
      variant={variant}
      isLoading={isLoading || isFetching}
      options={countedData || []}
      // countValue={countValues}
      // valueStyles={caseStatusStyles}
      selectedValues={filters.stage}
      iconClassName="size-5"
      setSelectedValues={(values) =>
        navigate({
          search: (prev: OldApartmentSearch) => ({
            ...prev,
            stage: values.length > 0 ? values : undefined,
          }),
        })
      }
    />
  );
};

export { OldApartmentStageFilter };
