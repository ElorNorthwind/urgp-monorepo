import {
  Button,
  FacetFilter,
  HStack,
  Input,
  NestedFacetFilter,
  ScrollArea,
  ScrollBar,
  Skeleton,
} from '@urgp/client/shared';
import {
  GetOldBuldingsDto,
  OldApartmentSearch,
  OldAppartment,
} from '@urgp/shared/entities';
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
import {
  relocationAge,
  relocationStatus,
  relocationTypes,
  renovationDefectStatus,
  renovationProblems,
  useOldBuildingList,
} from '@urgp/client/entities';
import { OldApartmentStageFilter } from './StageFilter';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Row } from '@tanstack/react-table';
import { LoadedResultCounter } from '../../LoadedResultCounter';

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

export const relocationBuildingDeviations = [
  {
    value: 'Работа завершена',
    label: 'Работа завершена',
    icon: CircleCheck,
    className: 'text-emerald-500',
  },
  // {
  //   value: 'В работе у МФР',
  //   label: 'В работе у МФР',
  //   icon: CircleDollarSign,
  //   className: 'text-violet-500',
  // },
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
    value: 'Наступили риски',
    label: 'Наступили риски',
    icon: CircleX,
    className: 'text-red-500',
  },
];

type OldApartmentFilterProps = {
  // filters: OldApartmentSearch;
  // setFilters: (value: Partial<OldApartmentSearch>) => void;
  currentCount?: number;
  totalCount?: number;
  isFetching?: boolean;
  apartments: Row<OldAppartment>[] | undefined;
};

const OldApartmentFilter = ({
  // filters,
  // setFilters,
  currentCount,
  totalCount,
  isFetching,
  apartments,
}: OldApartmentFilterProps): JSX.Element => {
  const filters = getRouteApi(
    '/renovation/oldapartments',
  ).useSearch() as OldApartmentSearch;
  const navigate = useNavigate({ from: '/renovation/oldapartments' });

  const validFilters = useMemo(() => {
    return { ...filters, apartment: undefined, stage: undefined };
  }, [filters]);

  const filteredAreas = useMemo(() => {
    return areas.filter((area) =>
      filters.okrugs?.some((okrug) => okrug === area.value),
    );
  }, [filters.okrugs]);

  const { data: adressList, isLoading: isAdressListLoading } =
    useOldBuildingList();

  return (
    <div className="flex w-full flex-nowrap items-center justify-start gap-2">
      <Input
        type="search"
        placeholder="Поиск по ФИО"
        inputClassName="px-2 lg:px-3"
        className="h-8 w-40 flex-shrink-0"
        value={filters.fio || ''}
        onChange={(event) =>
          navigate({
            search: (prev: OldApartmentSearch) => ({
              ...prev,
              fio:
                event.target.value && event.target.value.length > 0
                  ? event.target.value
                  : undefined,
            }),
          })
        }
      />
      <div className="group relative -mt-2 h-10 w-full flex-grow overflow-hidden p-0 hover:overflow-visible">
        <div className="group-hover:bg-muted absolute top-0 z-50 flex h-8 w-full flex-wrap items-center justify-start gap-2 p-2  group-hover:h-max group-hover:rounded-b group-hover:border-b group-hover:shadow-sm">
          <FacetFilter
            className="flex-grow"
            triggerClassName="flex-grow"
            options={areas}
            title="АО"
            selectedValues={filters.okrugs}
            setSelectedValues={(value) => {
              const isValueSet = value && value.length > 0;

              const allowedDistricts = areas
                .filter((area) => value.some((okrug) => okrug === area.value))
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

              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  ...filterObject,
                }),
              });
              //
            }}
          />
          <NestedFacetFilter
            groups={filters.okrugs ? filteredAreas : areas}
            title="Район"
            selectAllToggle
            selectedValues={filters.districts}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  districts: value && value.length > 0 ? value : undefined,
                }),
              })
            }
          />

          <FacetFilter
            options={relocationTypes}
            title={'Тип переселения'}
            noSearch
            selectedValues={filters.relocationType}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  relocationType: value && value.length > 0 ? value : undefined,
                }),
              })
            }
          />

          <FacetFilter
            options={relocationStatus}
            title={'Статус дома'}
            selectedValues={filters.relocationStatus}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  relocationStatus:
                    value && value.length > 0 ? value : undefined,
                }),
              })
            }
          />

          <FacetFilter
            options={relocationAge}
            title={'Срок переселения дома'}
            selectedValues={filters.relocationAge}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  relocationAge: value && value.length > 0 ? value : undefined,
                }),
              })
            }
          />

          <FacetFilter
            options={relocationBuildingDeviations}
            title={'Отклонение по дому'}
            selectedValues={filters.buildingDeviation}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  buildingDeviation:
                    value && value.length > 0 ? value : undefined,
                }),
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
                navigate({
                  search: (prev: OldApartmentSearch) => ({
                    ...prev,
                    buildingIds: value && value.length > 0 ? value : undefined,
                  }),
                })
              }
            />
          )}

          <FacetFilter
            options={relocationDeviations}
            title={'Отклонения'}
            selectedValues={filters.deviation}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  deviation: value && value.length > 0 ? value : undefined,
                }),
              })
            }
          />

          <FacetFilter
            options={renovationDefectStatus}
            title={'Дефекты'}
            selectedValues={filters.defect}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  defect: value && value.length > 0 ? value : undefined,
                }),
              })
            }
          />

          <FacetFilter
            options={renovationProblems}
            title={'Трудности'}
            selectedValues={filters.problem}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  problem: value && value.length > 0 ? value : undefined,
                }),
              })
            }
          />

          <OldApartmentStageFilter
            filters={filters}
            apartments={apartments}
            validFilters={validFilters}
          />
        </div>
      </div>
      <Button
        variant={'secondary'}
        onClick={() =>
          navigate({
            search: (prev: OldApartmentSearch) => ({
              ...prev,
              relocationType: [1],
              relocationAge: [
                'Менее месяца',
                'От 1 до 2 месяцев',
                'От 2 до 5 месяцев',
                'От 5 до 8 месяцев',
                'Более 8 месяцев',
              ],
              relocationStatus: ['Переселение'],
              buildingDeviation: [
                'Наступили риски',
                'Требует внимания',
                'Без отклонений',
              ],
              // adress: undefined,
              // MFRInvolvment: ['Без МФР'],
            }),
          })
        }
        className="h-8 bg-amber-100 px-2 hover:bg-amber-200 lg:px-3"
      >
        В работе
      </Button>

      {(filters?.okrugs ||
        filters?.districts ||
        filters?.buildingIds ||
        filters?.fio ||
        filters?.deviation ||
        filters?.stage ||
        filters?.defect ||
        filters?.problem ||
        filters?.relocationStatus ||
        filters?.relocationType ||
        filters?.relocationAge ||
        filters?.buildingDeviation) && (
        <Button
          variant="ghost"
          onClick={() =>
            navigate({
              search: (prev: OldApartmentSearch) => ({
                ...prev,
                okrugs: undefined,
                districts: undefined,
                buildingIds: undefined,
                fio: undefined,
                deviation: undefined,
                problem: undefined,
                defect: undefined,
                stage: undefined,
                relocationStatus: undefined,
                relocationType: undefined,
                relocationAge: undefined,
                buildingDeviation: undefined,
              }),
            })
          }
          className="h-8 px-2 lg:px-3"
        >
          Сброс
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
      <LoadedResultCounter
        currentCount={currentCount}
        totalCount={totalCount}
        isFetching={isFetching}
        className="ml-auto h-8 flex-shrink-0 flex-nowrap"
      />
    </div>
  );
};

export { OldApartmentFilter };
