import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { equityClaimTransferStyles } from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import { EquityObjectsPageSearch } from '@urgp/shared/entities';

type EquityClaimTransferFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const EquityClaimTransferFilter = (
  props: EquityClaimTransferFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'claimTransfer',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as EquityObjectsPageSearch;

  const data = [
    {
      value: 'Дата включения в РТУС',
      label: 'Дата включения в РТУС',
      items: [
        ...Object.keys(equityClaimTransferStyles).map((key) => ({
          tags: [],
          label: equityClaimTransferStyles[key]?.label || '',
          value: key,
          category: 'claimPerion',
          fullname: equityClaimTransferStyles[key]?.fullLabel || '',
        })),
      ],
    },
  ];

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Дата включения в РТУС"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      valueStyles={equityClaimTransferStyles}
      selectedValues={search.claimTransfer}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            claimTransfer: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityClaimTransferFilter };
