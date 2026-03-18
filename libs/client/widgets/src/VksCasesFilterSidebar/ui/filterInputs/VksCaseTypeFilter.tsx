import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  caseTypesStyles,
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

type VksCaseTypeFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const VksCaseTypeFilter = (props: VksCaseTypeFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'caseType',
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
      value: 'caseTypes',
      label: 'способ обращения',
      items: ['ВКС', 'ГЛ'].map((t) => {
        return {
          value: t,
          label:
            caseTypesStyles?.[t as keyof typeof caseTypesStyles]?.label ||
            'Нет данных',
          category: 'caseTypes',
          fullname: '0',
          tags: [],
        };
      }),
    },
  ] as NestedClassificatorInfoString[];

  return (
    <ClassificatorFilter<string>
      accordionItemValue={accordionItemValue}
      label="Способ обращения"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      valueStyles={caseTypesStyles}
      selectedValues={search.caseType}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            caseType: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { VksCaseTypeFilter };
