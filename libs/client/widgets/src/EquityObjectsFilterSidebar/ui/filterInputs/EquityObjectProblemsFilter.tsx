import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { equityProblemsStyles } from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import { EquityObjectsPageSearch } from '@urgp/shared/entities';

type EquityObjectProblemsFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const EquityObjectProblemsFilter = (
  props: EquityObjectProblemsFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'problems',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as EquityObjectsPageSearch;

  const data = [
    {
      value: 'Типы объектов',
      label: 'Типы объектов',
      items: [
        ...Object.keys(equityProblemsStyles).map((key) => ({
          tags: [],
          label: equityProblemsStyles[key]?.label || '',
          value: key,
          category: 'problems',
          fullname: equityProblemsStyles[key]?.fullLabel || '',
        })),
      ],
    },
  ];

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Проблемы"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      valueStyles={equityProblemsStyles}
      selectedValues={search.problem}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            problem: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityObjectProblemsFilter };
