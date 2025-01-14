import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { viewStatusStyles } from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';

type ViewStatusFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const viewStatuses = [
  {
    value: 'Статусы наблюдения',
    label: 'Статусы наблюдения',
    items: [
      {
        tags: ['нет', 'не слежу'],
        label: 'Не отслеживаю',
        value: 'unwatched',
        category: 'Статусы наблюдения',
      },
      {
        tags: ['не менялось'],
        label: 'Без изменений',
        value: 'unchanged',
        category: 'Статусы наблюдения',
      },
      {
        tags: ['новое'],
        label: 'Новое дело',
        value: 'new',
        category: 'Статусы наблюдения',
      },
      {
        tags: ['изменения'],
        label: 'Есть изменения',
        value: 'changed',
        category: 'Статусы наблюдения',
      },
    ],
  },
];

const ViewStatusFilter = (props: ViewStatusFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'viewStatus',
  } = props;

  const navigate = useNavigate({ from: '/control' });
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Изменения"
      className={cn('w-full', className)}
      variant={variant}
      options={viewStatuses}
      valueStyles={viewStatusStyles}
      selectedValues={search.viewStatus}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            viewStatus: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { ViewStatusFilter };
