import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  DateRangeSelect,
  DateRangeSelectAdvanced,
} from '@urgp/client/features';
import { VksRoutes } from '@urgp/client/shared';
import { VksCasesPageSearch } from '@urgp/shared/entities';
import { format, subDays, toDate } from 'date-fns';

type VksCasesDateFilterProps = {
  className?: string;
  align?: 'center' | 'end' | 'start';
};

const VksCasesDateFilter = (props: VksCasesDateFilterProps): JSX.Element => {
  const { className, align } = props;
  const pathname = useLocation().pathname as VksRoutes;
  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;

  return (
    <DateRangeSelectAdvanced
      align={align}
      onUpdate={(range) =>
        navigate({
          search: {
            ...search,
            dateFrom: range?.from
              ? format(range.from, 'yyyy-MM-dd')
              : undefined,
            dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
          },
        })
      }
      // confirmationButtons
      undefinedOnDefault
      controlledRange={{
        from: search?.dateFrom,
        to: search?.dateTo,
      }}
    />
  );

  // return (
  //   <DateRangeSelect
  //     label="Период"
  //     align={align}
  //     placeholder={`${format(subDays(new Date(), 30), 'dd.MM.yyyy')} - ${format(new Date(), 'dd.MM.yyyy')}`}
  //     className={className}
  //     from={search.dateFrom ? toDate(search.dateFrom) : undefined}
  //     to={search.dateTo ? toDate(search.dateTo) : undefined}
  //     onSelect={(range) =>
  //       navigate({
  //         search: {
  //           ...search,
  //           dateFrom: range?.from
  //             ? format(range.from, 'yyyy-MM-dd')
  //             : undefined,
  //           dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
  //         },
  //       })
  //     }
  //   />
  // );
};

export { VksCasesDateFilter };
