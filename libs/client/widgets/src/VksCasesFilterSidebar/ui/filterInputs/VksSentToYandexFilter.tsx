import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, VksRoutes } from '@urgp/client/shared';
import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  VksCasesPageSearch,
} from '@urgp/shared/entities';

type VksSentToYandexFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const VksSentToYandexFilter = (
  props: VksSentToYandexFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'SentToYandex',
  } = props;
  const pathname = useLocation().pathname as VksRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;

  const data = [
    {
      value: 'SentToYandex',
      label: 'направлен на яндекс',
      items: [
        {
          value: 1,
          label: 'Направлен',
          category: 'SentToYandex',
          fullname: 'Клиент направлен на Яндекс',
          tags: ['да'],
        },
        {
          value: 0,
          label: 'Не направлен',
          category: 'SentToYandex',
          fullname: 'Клиент не направлен на Яндекс',
          tags: ['нет'],
        },
      ],
    },
  ] as NestedClassificatorInfo[];

  return (
    <ClassificatorFilter<number>
      accordionItemValue={accordionItemValue}
      label="Направлен на Яндекс"
      className={cn('w-full', className)}
      variant={variant}
      options={data}
      // valueStyles={vksCaseGradeStyles}
      selectedValues={search.yandex}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            yandex: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { VksSentToYandexFilter };
