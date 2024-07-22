import { oldBuildingsColumns, useOldBuldings } from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  cn,
  HStack,
  TooltipProvider,
  useDebounce,
  VirtualDataTable,
  VStack,
} from '@urgp/client/shared';
import { LoadedResultCounter, OldBuildingsFilter } from '@urgp/client/widgets';
import { useCallback, useState } from 'react';
import { GetOldBuldingsDto, OldBuilding } from '@urgp/shared/entities';

const OldBuildingsPage = (): JSX.Element => {
  const filters = getRouteApi('/oldbuildings').useSearch() as GetOldBuldingsDto;
  const debouncedFilters = useDebounce(filters, 200);

  const navigate = useNavigate({ from: '/oldbuildings' });
  const [offset, setOffset] = useState(0);

  const [currentAdress, setCurrentAddress] = useState<OldBuilding | null>(null);

  const {
    currentData: buildings,
    isLoading,
    isFetching,
  } = useOldBuldings({
    ...(debouncedFilters as Partial<GetOldBuldingsDto>),
    offset,
  });

  const setFilters = useCallback(
    (value: Partial<GetOldBuldingsDto>) => {
      navigate({
        search: (prev: GetOldBuldingsDto) => ({
          ...prev,
          ...value,
        }),
      });
    },
    [navigate],
  );

  return (
    <VStack gap="s" align="start" className="relative w-full p-2">
      <HStack justify={'between'} className="w-full pr-2">
        <OldBuildingsFilter filters={filters} setFilters={setFilters} />
        <LoadedResultCounter
          currentCount={buildings?.length}
          totalCount={buildings?.[0]?.totalCount}
          isFetching={isFetching}
        />
      </HStack>
      {/* <HoverCard> */}
      <TooltipProvider>
        <HStack gap="s" className="w-full">
          <VirtualDataTable
            // onRowDoubleClick={() => setCurrentAddress(null)}
            onRowClick={(row) => {
              row.toggleSelected();
              setCurrentAddress(
                row?.original?.id === currentAdress?.id ? null : row?.original,
              );
            }}
            className={cn(
              'h-[calc(100vh-4.8rem)] transition-all',
              currentAdress ? 'w-[calc(100%-520px-0.5rem)]' : 'w-full',
            )}
            columns={oldBuildingsColumns}
            data={buildings || []}
            isFetching={isLoading || isFetching}
            totalCount={buildings?.[0]?.totalCount ?? 0}
            callbackFn={() => setOffset(buildings?.length || 0)}
            callbackMargin={3000}
            enableMultiRowSelection={false}
          />

          <Card
            className={cn(
              'h-[calc(100vh-4.8rem)] overflow-hidden transition-all',
              currentAdress ? 'w-[520px]' : 'w-0',
            )}
          >
            <CardHeader>{currentAdress?.adress}</CardHeader>
            <CardContent>
              {currentAdress && (
                <div className="w-full">
                  {JSON.stringify(currentAdress.problematicAparts)}
                </div>
              )}
              <Button onClick={() => setCurrentAddress(null)}>X</Button>
            </CardContent>
          </Card>
        </HStack>
      </TooltipProvider>
      {/* </HoverCard> */}
    </VStack>
  );
};

export { OldBuildingsPage };
