import { oldBuildingsColumns, useOldBuldings } from '@urgp/client/entities';
import {
  getRouteApi,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import {
  Button,
  DataTable,
  HStack,
  onBottomReached,
  ScrollArea,
  VirtualDataTable,
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

  // const loaderData = useLoaderData({ from: '/oldbuildings' });

  useEffect(() => {
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
          {buildings && buildings.length > 0 && buildings[0].totalCount && (
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
      <VirtualDataTable
        className="h-[calc(100vh-4rem)] w-full"
        columns={oldBuildingsColumns}
        data={buildings || []}
        isFetching={isLoading || isFetching}
        totalCount={buildings?.[0].totalCount ?? 0}
        callbackFn={() => setOffset(buildings?.length || 0)}
        callbackMargin={1500}
      />
    </VStack>
  );
};

export { OldBuildingsPage };
