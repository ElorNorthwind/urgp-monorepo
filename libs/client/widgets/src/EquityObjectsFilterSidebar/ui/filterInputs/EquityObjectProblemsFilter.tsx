import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  equityBuildingStyles,
  equityObjectTypeStyles,
  equityProblemsStyles,
  useEquityBuildings,
  useEquityObjectTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import {
  EquityObjectProblems,
  EquityObjectsPageSearch,
} from '@urgp/shared/entities';

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
        {
          tags: [],
          label: 'Не идентифицировано',
          value: EquityObjectProblems.unidentified,
          category: 'problems',
          fullname: 'Требование не удалось соотнести с реальным объектом',
        },
        {
          tags: [],
          label: 'Дефекты',
          value: EquityObjectProblems.defects,
          category: 'problems',
          fullname: 'В ходе работы с объектом выявлены дефекты',
        },
        {
          tags: [],
          label: 'Двойная продажа',
          value: EquityObjectProblems['double-sell'],
          category: 'problems',
          fullname: 'Выявлены признаки конкурирубщих требований',
        },
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
            type: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityObjectProblemsFilter };
