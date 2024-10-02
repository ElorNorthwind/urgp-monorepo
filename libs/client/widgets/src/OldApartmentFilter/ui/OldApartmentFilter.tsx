import {
  Button,
  FacetFilter,
  HStack,
  Input,
  NestedFacetFilter,
  Skeleton,
} from '@urgp/client/shared';
import { GetOldBuldingsDto, OldApartmentSearch } from '@urgp/shared/entities';
import {
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  CircleEllipsis,
  CircleX,
  X,
} from 'lucide-react';
import { useMemo } from 'react';
import { areas } from '../../OldBuildingsFilter/config/areas';
import { useOldBuildingList } from '@urgp/client/entities';

export const relocationDeviations = [
  {
    value: 'Работа завершена',
    label: 'Работа завершена',
    icon: CircleCheck,
    className: 'text-emerald-500',
  },
  {
    value: 'В работе у МФР',
    label: 'В работе у МФР',
    icon: CircleDollarSign,
    className: 'text-violet-500',
  },
  {
    value: 'Без отклонений',
    label: 'Без отклонений',
    icon: CircleEllipsis,
    className: 'text-blue-500',
  },
  {
    value: 'Требует внимания',
    label: 'Требует внимания',
    icon: CircleAlert,
    className: 'text-yellow-500',
  },
  {
    value: 'Риск',
    label: 'Наступили риски',
    icon: CircleX,
    className: 'text-red-500',
  },
];

type OldApartmentFilterProps = {
  filters: OldApartmentSearch;
  setFilters: (value: Partial<OldApartmentSearch>) => void;
};

const OldApartmentFilter = ({
  filters,
  setFilters,
}: OldApartmentFilterProps): JSX.Element => {
  const filteredAreas = useMemo(() => {
    return areas.filter((area) =>
      filters.okrugs?.some((okrug) => okrug === area.value),
    );
  }, [filters.okrugs]);

  const { data: adressList, isLoading: isAdressListLoading } =
    useOldBuildingList();

  return (
    <HStack gap="s">
      <Input
        type="search"
        placeholder="Поиск по ФИО"
        className="h-8 w-40 px-2 lg:px-3"
        value={filters.fio || ''}
        onChange={(event) =>
          setFilters({
            fio:
              event.target.value && event.target.value.length > 0
                ? event.target.value
                : undefined,
          })
        }
      />
      <FacetFilter
        options={areas}
        title="АО"
        selectedValues={filters.okrugs}
        setSelectedValues={
          (value) => {
            const isValueSet = value && value.length > 0;

            const allowedDistricts = areas
              .filter((area) => value.some((okrug) => okrug === area.value))
              .reduce((accumulator, current) => {
                return [
                  ...accumulator,
                  ...current.items.map((item) => item.value),
                ];
              }, [] as string[]);

            const filteredDistricts = filters.districts?.filter((district) => {
              return allowedDistricts.some((allowed) => allowed === district);
            });

            const filterObject = {
              okrugs: isValueSet ? value : undefined,
            } as Partial<GetOldBuldingsDto>;

            filterObject.districts = isValueSet
              ? filteredDistricts && filteredDistricts.length > 0
                ? filteredDistricts
                : undefined
              : filters?.districts;

            setFilters(filterObject);
          }
          //
        }
      />
      <NestedFacetFilter
        groups={filters.okrugs ? filteredAreas : areas}
        title="Район"
        selectAllToggle
        selectedValues={filters.districts}
        setSelectedValues={(value) =>
          setFilters({
            districts: value && value.length > 0 ? value : undefined,
          })
        }
      />
      {isAdressListLoading ? (
        <Skeleton className="h-8 w-28" />
      ) : (
        <FacetFilter
          options={adressList || []}
          title={'Здание'}
          selectedValues={filters.buildingIds}
          setSelectedValues={(value) =>
            setFilters({
              buildingIds: value && value.length > 0 ? value : undefined,
            })
          }
        />
      )}

      <FacetFilter
        options={relocationDeviations}
        title={'Отклонения'}
        selectedValues={filters.deviation}
        setSelectedValues={(value) =>
          setFilters({
            deviation: value && value.length > 0 ? value : undefined,
          })
        }
      />
      {(filters?.okrugs ||
        filters?.districts ||
        filters?.buildingIds ||
        filters?.fio) && (
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({
              okrugs: undefined,
              districts: undefined,
              buildingIds: undefined,
              fio: undefined,
            })
          }
          className="h-8 px-2 lg:px-3"
        >
          Сброс
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </HStack>
  );
};

export { OldApartmentFilter };
