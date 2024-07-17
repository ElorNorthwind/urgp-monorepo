import {
  oldBuildingsColumns,
  OldBuildingsFilter,
  useOldBuldings,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Button, DataTable, HStack, VStack } from '@urgp/client/shared';
import { AreaFacetFilter } from '@urgp/client/widgets';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const OldBuildingsPage = (): JSX.Element => {
  const {
    limit,
    page,
    okrug,
    relocationType,
    status,
    dificulty,
    deviation,
    relocationAge,
    relocationStatus,
    adress,
  } = getRouteApi('/oldbuildings').useSearch();

  const [districts, setDistricts] = useState<string[]>([]);
  const navigate = useNavigate({ from: '/oldbuildings' });

  useEffect(() => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        districts: districts.length > 0 ? districts : undefined,
      }),
    });
  }, [districts, navigate]);

  const {
    data: buildings,
    isLoading,
    isFetching,
  } = useOldBuldings({ limit, page, okrug, districts: districts.join(',') });

  return (
    <VStack gap="s" align="start" className="relative w-full p-2">
      {/* <OldBuildingsFilter /> */}
      <HStack>
        <AreaFacetFilter
          title="Район"
          selectedValues={districts}
          setSelectedValues={(value) => setDistricts(value)}
        />
        {districts.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => setDistricts([])}
            className="h-8 px-2 lg:px-3"
          >
            Сброс
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </HStack>
      {/* <Card className="w-full p-4"> */}
      <DataTable
        columns={oldBuildingsColumns}
        data={buildings || []}
        isLoading={isLoading || isFetching}
      />
      {/* </Card> */}
    </VStack>
  );
};

export { OldBuildingsPage };
