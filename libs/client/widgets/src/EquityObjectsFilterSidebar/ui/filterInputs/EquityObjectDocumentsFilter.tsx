import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  equityDocumentsStyles,
  equityProblemsStyles,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import { EquityObjectsPageSearch } from '@urgp/shared/entities';

type EquityObjectDocumentsFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const EquityObjectDocumentsFilter = (
  props: EquityObjectDocumentsFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'documents',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as EquityObjectsPageSearch;

  const data = [
    {
      value: 'Статус подачи документов',
      label: 'Статус подачи документов',
      items: [
        ...Object.keys(equityDocumentsStyles).map((key) => ({
          tags: [],
          label: equityDocumentsStyles[key]?.label || '',
          value: key,
          category: 'documents',
          fullname: equityDocumentsStyles[key]?.fullLabel || '',
        })),
      ],
    },
  ];

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Подача документов"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      valueStyles={equityDocumentsStyles}
      selectedValues={search.documents}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            documents: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityObjectDocumentsFilter };
