import {
  Button,
  FacetFilter,
  HStack,
  Input,
  NestedFacetFilter,
  ScrollArea,
  ScrollBar,
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
import { forwardRef, useMemo, useRef } from 'react';
import { areas } from '../config/areas';
import { format, toDate } from 'date-fns';
import { DateRangeSelect } from '@urgp/client/features';

type OldBuildingsFilterProps = {
  filters: GetOldBuldingsDto;
  setFilters: (value: Partial<GetOldBuldingsDto>) => void;
  isFetching?: boolean;
  totalCount?: number;
  filteredCount?: number;
};

const OldBuildingsFilter = forwardRef<HTMLDivElement, OldBuildingsFilterProps>(
  (
    { filters, setFilters, isFetching, totalCount, filteredCount },
    ref,
  ): JSX.Element => {
    const filteredAreas = useMemo(() => {
      return areas.filter((area) =>
        filters.okrugs?.some((okrug) => okrug === area.value),
      );
    }, [filters.okrugs]);

    return (
      <div
        className="flex flex-nowrap items-center justify-start gap-2"
        ref={ref}
      >
        <Input
          type="search"
          placeholder="Поиск по адресу"
          inputClassName="px-2 lg:px-3"
          className="h-8 w-40 flex-shrink-0"
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
        <ScrollArea className="-mb-2 w-full overflow-x-auto">
          <ScrollBar orientation="horizontal" />
          <div className="flex flex-nowrap items-center justify-start gap-2 pb-2">
            <FacetFilter
              options={areas}
              title="АО"
              selectedValues={filters.okrugs}
              setSelectedValues={
                (value) => {
                  const isValueSet = value && value.length > 0;

                  const allowedDistricts = areas
                    .filter((area) =>
                      value.some((okrug) => okrug === area.value),
                    )
                    .reduce((accumulator, current) => {
                      return [
                        ...accumulator,
                        ...current.items.map((item) => item.value),
                      ];
                    }, [] as string[]);

                  const filteredDistricts = filters.districts?.filter(
                    (district) => {
                      return allowedDistricts.some(
                        (allowed) => allowed === district,
                      );
                    },
                  );

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
                  relocationStatus:
                    value && value.length > 0 ? value : undefined,
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
            <DateRangeSelect
              from={filters.startFrom ? toDate(filters.startFrom) : undefined}
              to={filters.startTo ? toDate(filters.startTo) : undefined}
              onSelect={(range) =>
                setFilters({
                  startFrom: range?.from
                    ? format(range.from, 'yyyy-MM-dd')
                    : undefined,
                  startTo: range?.to
                    ? format(range.to, 'yyyy-MM-dd')
                    : undefined,
                })
              }
            />
          </div>
        </ScrollArea>
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
              relocationStatus: ['Переселение'],
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
          filters?.startFrom ||
          filters?.startTo ||
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
                startFrom: undefined,
                startTo: undefined,
              })
            }
            className="h-8 px-2 lg:px-3"
          >
            Сброс
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        <div className="text-muted-foreground ml-auto text-nowrap">
          {(filteredCount || '') +
            ' из ' +
            (totalCount || (isFetching ? '' : 0))}
        </div>
      </div>
    );
  },
);

export { OldBuildingsFilter };
