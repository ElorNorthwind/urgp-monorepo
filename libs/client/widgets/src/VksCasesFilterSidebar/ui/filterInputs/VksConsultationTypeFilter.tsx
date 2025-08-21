import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  consultationTypesStyles,
  propertyTypeStyles,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import {
  NestedClassificatorInfoString,
  VksCasesPageSearch,
  vksConsultationTypesValues,
} from '@urgp/shared/entities';

type VksConsultationTypeFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const VksConsultationTypeFilter = (
  props: VksConsultationTypeFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'type',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;

  // const { icon: PropertyTypeIcon, iconStyle: propertyTypeIconStyle } =
  //   propertyTypeStyles?.[
  //     (rowData?.propertyType ||
  //       'Жилищные вопросы') as keyof typeof propertyTypeStyles
  //   ] || Object.values(propertyTypeStyles)[0];

  const data = [
    {
      value: 'types',
      label: 'типы консультаций',
      items: vksConsultationTypesValues.map((t) => {
        return {
          value: t,
          label: consultationTypesStyles[t]?.label || 'Нет данных',
          category: 'types',
          fullname: '0',
          tags: [],
        };
      }),
    },
  ] as NestedClassificatorInfoString[];

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Тип консультации"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      valueStyles={consultationTypesStyles}
      selectedValues={search.type}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            type: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { VksConsultationTypeFilter };
