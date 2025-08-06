import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  equityObjectStatusStyles,
  useEquityObjectStatus,
  useVksStatusClassificator,
  vksCaseStatusStyles,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import {
  EquityObjectsPageSearch,
  NestedClassificatorInfo,
  VksCasesPageSearch,
} from '@urgp/shared/entities';

type VksCaseGradeFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const VksCaseGradeFilter = (props: VksCaseGradeFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'grade',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;

  const data = [
    {
      value: 'grades',
      label: 'оценки',
      items: [
        {
          value: 0,
          label: 'без оценки',
          category: 'grades',
          fullname: '0',
          tags: [],
        },
        {
          value: 1,
          label: '1 балл',
          category: 'grades',
          fullname: '1',
          tags: [],
        },
        {
          value: 2,
          label: '2 балла',
          category: 'grades',
          fullname: '2',
          tags: [],
        },
        {
          value: 3,
          label: '3 балла',
          category: 'grades',
          fullname: '3',
          tags: [],
        },
        {
          value: 4,
          label: '4 балла',
          category: 'grades',
          fullname: '4',
          tags: [],
        },
        {
          value: 5,
          label: '5 баллов',
          category: 'grades',
          fullname: '5',
          tags: [],
        },
      ],
    },
  ] as NestedClassificatorInfo[];

  return (
    <ClassificatorFilter<number>
      accordionItemValue={accordionItemValue}
      label="Оценка"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      // valueStyles={vksCaseGradeStyles}
      selectedValues={search.grade}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            grade: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { VksCaseGradeFilter };
