import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  controlToMeStyles,
  directionCategoryStyles,
  useDepartmentTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { CaseRoutes, cn } from '@urgp/client/shared';
import { CasesPageSearchDto, ControlToMeStatus } from '@urgp/shared/entities';

type ControlToMeFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const ControlToMeFilter = (props: ControlToMeFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'control',
  } = props;
  const pathname = useLocation().pathname as CaseRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;

  const options = [
    {
      value: 'Типа поручений',
      label: 'Типа поручений',
      items: [
        {
          value: ControlToMeStatus.direct,
          label: 'У меня на рассмотрении',
        },
        {
          value: ControlToMeStatus.deligated,
          label: 'Поручено мною сотруднику',
        },
        {
          value: ControlToMeStatus.none,
          label: 'Нет поручений в мой адрес',
        },
      ],
    },
  ];

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Мои поручения"
      className={cn('w-full', className)}
      variant={variant}
      // isLoading={isLoading || isFetching}
      options={options}
      valueStyles={controlToMeStyles}
      selectedValues={search.control}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            control: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { ControlToMeFilter };
