import { oldBuildingsColumns, useOldBuldings } from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  Button,
  DataTable,
  HStack,
  onBottomReached,
  ScrollArea,
  VStack,
} from '@urgp/client/shared';
import { AreaFacetFilter } from '@urgp/client/widgets';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { GetOldBuldingsDto } from '@urgp/shared/entities';

const OldBuildingsPage = (): JSX.Element => {
  const {
    limit,
    okrug,
    districts,
    relocationType,
    status,
    dificulty,
    deviation,
    relocationAge,
    relocationStatus,
    adress,
  } = getRouteApi('/oldbuildings').useSearch() as GetOldBuldingsDto;

  const navigate = useNavigate({ from: '/oldbuildings' });
  const [offset, setOffset] = useState(0);

  const {
    currentData: buildings,
    isLoading,
    isFetching,
  } = useOldBuldings({ limit, offset, okrug, districts });

  useEffect(() => {
    onBottomReached({
      callback: () => setOffset(buildings?.length || 0),
      containerRefElement: containerRef.current,
      disabled:
        isFetching ||
        (buildings && buildings.length >= buildings[0].totalCount),
      margin: 1500,
    });

    navigate({
      search: (prev: GetOldBuldingsDto) => ({
        ...prev,
        districts: districts && districts.length > 0 ? districts : undefined,
      }),
    });
  }, [buildings, districts, isFetching, navigate]);

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  return (
    <VStack
      gap="s"
      align="start"
      className="relative  w-full overflow-auto  p-2"
    >
      <HStack justify={'between'} className="w-full pr-2">
        <HStack>
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
        </HStack>
        <HStack gap="s">
          {buildings && buildings.length > 0 && (
            <>
              {isFetching && (
                <LoaderCircle className="stroke-muted-foreground animate-spin" />
              )}
              <div className="text-muted-foreground">
                {buildings.length} из {buildings[0].totalCount}
              </div>
            </>
          )}
        </HStack>
      </HStack>
      <ScrollArea
        className="relative h-[calc(100vh-4rem)] w-full overflow-auto rounded-md border "
        ref={containerRef}
        onScroll={(e) => {
          onBottomReached({
            callback: () => setOffset(buildings?.length || 0),
            containerRefElement: containerRef.current,
            disabled:
              isFetching ||
              (buildings && buildings.length >= buildings[0].totalCount),
            margin: 1500,
          });
        }}
      >
        <DataTable
          columns={oldBuildingsColumns}
          data={buildings || []}
          isFetching={isLoading || isFetching}
        />
      </ScrollArea>
    </VStack>
  );
};

export { OldBuildingsPage };
