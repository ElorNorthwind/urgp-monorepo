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
import { relocationDeviations } from '../../OldApartmentFilter';

type SpecialApartmentFilterProps = {
  filters: OldApartmentSearch;
  setFilters: (value: Partial<OldApartmentSearch>) => void;
  totalCount?: number;
  filteredCount?: number;
};

const SpecialApartmentFilter = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
}: SpecialApartmentFilterProps): JSX.Element => {
  const filteredAreas = useMemo(() => {
    return areas.filter((area) =>
      filters.okrugs?.some((okrug) => okrug === area.value),
    );
  }, [filters.okrugs]);

  return (
    <HStack gap="s">
      <Input
        type="search"
        placeholder="Поиск по ФИО"
        inputClassName="px-2 lg:px-3"
        className="h-8 w-40"
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

      <Button
        variant={'secondary'}
        onClick={() =>
          setFilters({
            deviation: ['Требует внимания', 'Без отклонений', 'Риск'],
            // %5B"Наступили%20риски"%2C"Требует%20внимания"%2C"Без%20отклонений"%2C"Риск"%5D
          })
        }
        className="h-8 bg-amber-100 px-2 hover:bg-amber-200 lg:px-3"
      >
        В работе
      </Button>

      {(filters?.okrugs ||
        filters?.districts ||
        filters?.deviation ||
        filters?.fio) && (
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({
              okrugs: undefined,
              districts: undefined,
              deviation: undefined,
              fio: undefined,
            })
          }
          className="h-8 px-2 lg:px-3"
        >
          Сброс
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
      <div className="text-muted-foreground ml-auto">
        {(filteredCount || '') + ' из ' + (totalCount || 0)}
      </div>
    </HStack>
  );
};

export { SpecialApartmentFilter };
