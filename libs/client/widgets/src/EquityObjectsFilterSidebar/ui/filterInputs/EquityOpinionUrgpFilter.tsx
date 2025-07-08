import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  equityDocumentsStyles,
  equityOpinionsStyles,
  equityProblemsStyles,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import { EquityObjectsPageSearch } from '@urgp/shared/entities';

type EquityOpinionUrgpFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const EquityOpinionUrgpFilter = (
  props: EquityOpinionUrgpFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'opinionsUrgp',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as EquityObjectsPageSearch;

  const data = [
    {
      value: 'Заключение УРЖП',
      label: 'Заключение УРЖП',
      items: [
        ...Object.keys(equityOpinionsStyles).map((key) => ({
          tags: [],
          label: equityOpinionsStyles[key]?.label || '',
          value: key,
          category: 'opinions',
          fullname: equityOpinionsStyles[key]?.fullLabel || '',
        })),
      ],
    },
  ];

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Заключение УРЖП"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      valueStyles={equityOpinionsStyles}
      selectedValues={search.opinionUrgp}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            opinionUrgp: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityOpinionUrgpFilter };
