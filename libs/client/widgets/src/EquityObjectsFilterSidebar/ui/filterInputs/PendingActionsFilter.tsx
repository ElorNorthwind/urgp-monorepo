import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  pendingActionStyles,
  useDepartmentTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { CaseRoutes, cn } from '@urgp/client/shared';
import { CaseActions, CasesPageSearchDto } from '@urgp/shared/entities';

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
          value: CaseActions.caseApprove,
          label: 'Проект заявки',
        },
        {
          value: CaseActions.operationApprove,
          label: 'Проект решения',
        },
        {
          value: CaseActions.reminderDone,
          label: 'Исполнитель закончил',
        },
        {
          value: CaseActions.reminderOverdue,
          label: 'Заявка просрочена',
        },
        {
          value: CaseActions.caseRejected,
          label: 'Мой проект отклонен',
        },
        {
          value: CaseActions.escalation,
          label: 'Запрошено мое решение',
        },
        {
          value: CaseActions.unknown,
          label: 'Действий не требуется',
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
