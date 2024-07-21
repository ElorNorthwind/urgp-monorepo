import { Button, FacetFilter, HStack, Input } from '@urgp/client/shared';
import { GetOldBuldingsDto } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { AreaFacetFilter } from './AreaFacetFilter';
import {
  relocationAge,
  relocationDeviations,
  relocationStatus,
  relocationTypes,
} from '@urgp/client/entities';

type OldBuildingsFilterProps = {
  filters: GetOldBuldingsDto;
  setFilters: (value: Partial<GetOldBuldingsDto>) => void;
};

const OldBuildingsFilter = ({
  filters,
  setFilters,
}: OldBuildingsFilterProps): JSX.Element => {
  return (
    <HStack>
      <Input
        type="search"
        placeholder="Поиск по адресу"
        className="h-8 w-40 px-2 lg:px-3"
        value={filters.adress || ''}
        onChange={(event) =>
          setFilters({
            adress:
              event.target.value && event.target.value.length > 0
                ? event.target.value
                : undefined,
          })
        }
      />
      <AreaFacetFilter
        title="Район"
        selectedValues={filters.districts}
        setSelectedValues={(value) =>
          setFilters({
            districts: value && value.length > 0 ? value : undefined,
          })
        }
      />
      <FacetFilter
        options={relocationTypes}
        title={'Тип'}
        selectedValues={filters.relocationType}
        setSelectedValues={(value) =>
          setFilters({
            relocationType: value && value.length > 0 ? value : undefined,
          })
        }
      />

      <FacetFilter
        options={relocationAge}
        title={'Срок'}
        selectedValues={filters.relocationAge}
        setSelectedValues={(value) =>
          setFilters({
            relocationAge: value && value.length > 0 ? value : undefined,
          })
        }
      />

      <FacetFilter
        options={relocationStatus}
        title={'Статус'}
        selectedValues={filters.relocationStatus}
        setSelectedValues={(value) =>
          setFilters({
            relocationStatus: value && value.length > 0 ? value : undefined,
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
            districts: undefined,
            relocationType: [1],
            relocationAge: [
              'Менее месяца',
              'От 1 до 2 месяцев',
              'От 2 до 5 месяцев',
              'От 5 до 8 месяцев',
              'Более 8 месяцев',
            ],
            relocationStatus: undefined,
            deviation: ['Есть риски', 'Требует внимания', 'Без отклонений'],
            adress: undefined,
          })
        }
        className="h-8 bg-amber-100 px-2 hover:bg-amber-200 lg:px-3"
      >
        В работе
      </Button>

      {(filters?.districts ||
        filters?.relocationType ||
        filters?.relocationAge ||
        filters.relocationStatus ||
        filters?.deviation ||
        filters?.adress) && (
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({
              districts: undefined,
              relocationType: undefined,
              relocationAge: undefined,
              relocationStatus: undefined,
              deviation: undefined,
              adress: undefined,
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

export { OldBuildingsFilter };
