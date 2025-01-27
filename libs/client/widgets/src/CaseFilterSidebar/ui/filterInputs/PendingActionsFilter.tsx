import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  pendingActionStyles,
  useDepartmentTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { CaseRoutes, cn } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';

type PendingActionsFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const PendingActionsFilter = (
  props: PendingActionsFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'action',
  } = props;
  const pathname = useLocation().pathname as CaseRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;
  const data = [
    {
      value: 'Типы действий',
      label: 'Типы действий',
      items: [
        {
          value: 'case-approve',
          label: 'Проект заявки',
        },
        {
          value: 'operation-approve',
          label: 'Проект решения',
        },
        {
          value: 'reminder-done',
          label: 'Исполнитель отчитался',
        },
        {
          value: 'reminder-overdue',
          label: 'Заявка просрочена',
        },
        {
          value: 'case-rejected',
          label: 'Мой проект отклонен',
        },
      ],
    },
  ];

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Требуемые действия"
      className={cn('w-full', className)}
      variant={variant}
      // isLoading={isLoading || isFetching}
      options={data || []}
      valueStyles={pendingActionStyles}
      selectedValues={search.action}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            action: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { PendingActionsFilter };
