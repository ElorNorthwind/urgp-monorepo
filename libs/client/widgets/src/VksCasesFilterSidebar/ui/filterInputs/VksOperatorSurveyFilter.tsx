import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, VksRoutes } from '@urgp/client/shared';
import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  VksCasesPageSearch,
} from '@urgp/shared/entities';

type VksOperatorSurveyFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const VksOperatorSurveyFilter = (
  props: VksOperatorSurveyFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'operatorSurvey',
  } = props;
  const pathname = useLocation().pathname as VksRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;

  const data = [
    {
      value: 'operatorSurvey',
      label: 'анкета оператора',
      items: [
        {
          value: 1,
          label: 'Заполнена',
          category: 'grades',
          fullname: 'Анкета оператора заполнена',
          tags: [],
        },
        {
          value: 0,
          label: 'Не заполнена',
          category: 'grades',
          fullname: 'Анкета оператора не заполнена',
          tags: [],
        },
      ],
    },
  ] as NestedClassificatorInfo[];

  return (
    <ClassificatorFilter<number>
      accordionItemValue={accordionItemValue}
      label="Анкета оператора"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      // valueStyles={vksCaseGradeStyles}
      selectedValues={search.operatorSurvey}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            operatorSurvey: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { VksOperatorSurveyFilter };
