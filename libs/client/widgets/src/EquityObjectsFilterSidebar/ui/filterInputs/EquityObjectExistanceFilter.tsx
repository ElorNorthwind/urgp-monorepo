import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  equityDocumentsStyles,
  equityObjectExistanceStyles,
  equityOpinionsStyles,
  equityProblemsStyles,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import {
  equityObjectExistanceTypesValues,
  EquityObjectsPageSearch,
} from '@urgp/shared/entities';

type EquityObjectExistanceFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const EquityObjectExistanceFilter = (
  props: EquityObjectExistanceFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'exists',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as EquityObjectsPageSearch;

  const data = [
    {
      value: 'Реальность объекта',
      label: 'Реальность объекта',
      items: equityObjectExistanceTypesValues.map((key) => ({
        tags: [],
        label: equityObjectExistanceStyles[key]?.label || '',
        value: key,
        category: 'Реальность объекта',
        fullname: equityObjectExistanceStyles[key]?.fullLabel || '',
      })),
    },
  ];

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Реальность объекта"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      valueStyles={equityObjectExistanceStyles}
      selectedValues={search.exists}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            exists: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityObjectExistanceFilter };
