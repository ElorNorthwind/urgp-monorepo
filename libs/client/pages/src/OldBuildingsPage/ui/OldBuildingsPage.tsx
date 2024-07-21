import { oldBuildingsColumns, useOldBuldings } from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  Button,
  FacetFilter,
  HStack,
  VirtualDataTable,
  VStack,
} from '@urgp/client/shared';
import {
  AreaFacetFilter,
  LoadedResultCounter,
  OldBuildingsFilter,
} from '@urgp/client/widgets';
import { useEffect, useState } from 'react';
import { Blocks, Building2, House, LoaderCircle, X } from 'lucide-react';
import { GetOldBuldingsDto } from '@urgp/shared/entities';

const relocationTypes = [
  {
    value: 1,
    label: 'Полное переселение',
    icon: House,
  },
  {
    value: 2,
    label: 'Частичное отселение',
    icon: Blocks,
  },
  {
    value: 3,
    label: 'Многоэтапное отселение',
    icon: Building2,
  },
];

const OldBuildingsPage = (): JSX.Element => {
  const {
    limit,
    okrug,
    districts,
    relocationType,
    // status,
    // dificulty,
    // deviation,
    // relocationAge,
    // relocationStatus,
    // adress,
  } = getRouteApi('/oldbuildings').useSearch() as GetOldBuldingsDto;

  const navigate = useNavigate({ from: '/oldbuildings' });
  const [offset, setOffset] = useState(0);

  const {
    currentData: buildings,
    isLoading,
    isFetching,
  } = useOldBuldings({ limit, offset, okrug, districts, relocationType });

  return (
    <VStack gap="s" align="start" className="relative w-full p-2">
      <HStack justify={'between'} className="w-full pr-2">
        <OldBuildingsFilter />
        {/* <HStack>
          <AreaFacetFilter
            title="Район"
            selectedValues={districts}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: GetOldBuldingsDto) => ({
                  ...prev,
                  districts: value && value.length > 0 ? value : undefined,
                }),
              })
            }
          />
          <FacetFilter
            options={relocationTypes}
            title={'Тип переселения'}
            selectedValues={relocationType || []}
            setSelectedValues={(value) =>
              navigate({
                search: (prev: GetOldBuldingsDto) => ({
                  ...prev,
                  relocationType: value && value.length > 0 ? value : undefined,
                }),
              })
            }
          />

          {districts && districts.length > 0 && (
            <Button
              variant="ghost"
              onClick={() =>
                navigate({
                  search: (prev: GetOldBuldingsDto) => ({
                    ...prev,
                    districts: undefined,
                  }),
                })
              }
              className="h-8 px-2 lg:px-3"
            >
              Сброс
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </HStack> */}
        <LoadedResultCounter
          currentCount={buildings?.length}
          totalCount={buildings?.[0]?.totalCount}
          isFetching={isFetching}
        />
      </HStack>
      <VirtualDataTable
        className="h-[calc(100vh-4rem)] w-full"
        columns={oldBuildingsColumns}
        data={buildings || []}
        isFetching={isLoading || isFetching}
        totalCount={buildings?.[0]?.totalCount ?? 0}
        callbackFn={() => setOffset(buildings?.length || 0)}
        callbackMargin={1500}
      />
    </VStack>
  );
};

export { OldBuildingsPage };
