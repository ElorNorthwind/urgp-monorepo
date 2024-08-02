import {
  Button,
  FacetFilter,
  HStack,
  Input,
  NestedFacetFilter,
} from '@urgp/client/shared';
import { GetOldBuldingsDto } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import {
  // MFRInvolvmentTypes,
  relocationAge,
  relocationDeviations,
  relocationStatus,
  relocationTypes,
} from '@urgp/client/entities';
import { useMemo } from 'react';
import { areas } from '../config/areas';

type OldBuildingsFilterProps = {
  filters: GetOldBuldingsDto;
  setFilters: (value: Partial<GetOldBuldingsDto>) => void;
};

const OldBuildingsFilter = ({
  filters,
  setFilters,
}: OldBuildingsFilterProps): JSX.Element => {
  const filteredAreas = useMemo(() => {
    return areas.filter((area) =>
      filters.okrugs?.some((okrug) => okrug === area.value),
    );
  }, [filters.okrugs]);

  return (
    <HStack gap="s">
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
        options={relocationTypes}
        title={'Тип'}
        noSearch
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

      {/* <FacetFilter
        options={MFRInvolvmentTypes}
        title={'Фонд'}
        selectedValues={filters.MFRInvolvment}
        optionsWidth={80}
        noSearch
        setSelectedValues={(value) =>
          setFilters({
            MFRInvolvment: value && value.length > 0 ? value : undefined,
          })
        }
      /> */}
      {/* <div className="flex items-center space-x-2">
        <Switch
          id="show-mfr"
          defaultChecked
          checked={!filters.noMFR}
          onCheckedChange={(e) => setFilters({ noMFR: e ? undefined : true })}
        />
        <Label
          htmlFor="show-mfr"
          className={cn(
            'transition-opacity',
            filters.noMFR ? 'line-through opacity-30' : '',
          )}
        >
          МФР
        </Label>
      </div> */}
      <Button
        variant={'secondary'}
        onClick={() =>
          setFilters({
            // okrugs: undefined,
            // districts: undefined,
            relocationType: [1],
            relocationAge: [
              'Менее месяца',
              'От 1 до 2 месяцев',
              'От 2 до 5 месяцев',
              'От 5 до 8 месяцев',
              'Более 8 месяцев',
            ],
            // relocationStatus: undefined,
            deviation: [
              'Наступили риски',
              'Требует внимания',
              'Без отклонений',
            ],
            // adress: undefined,
            // MFRInvolvment: ['Без МФР'],
          })
        }
        className="h-8 bg-amber-100 px-2 hover:bg-amber-200 lg:px-3"
      >
        В работе
      </Button>

      {(filters?.okrugs ||
        filters?.districts ||
        filters?.relocationType ||
        filters?.relocationAge ||
        filters.relocationStatus ||
        filters?.deviation ||
        filters?.adress) && (
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({
              okrugs: undefined,
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
