import {
  oldBuildingsApi,
  oldBuildingsColumns,
  useOldBuldings,
} from '@urgp/client/entities';
import {
  getRouteApi,
  Link,
  useLoaderData,
  useNavigate,
  useRouteContext,
} from '@tanstack/react-router';
import {
  Button,
  DataTable,
  HStack,
  onBottomReached,
  rtkApi,
  ScrollArea,
  store,
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
import { X } from 'lucide-react';
import { GetOldBuldingsDto } from '@urgp/shared/entities';

const OldBuildingsPage = (): JSX.Element => {
  const {
    limit,
    page,
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

  // const [districts, setDistricts] = useState<string[]>([]);
  const navigate = useNavigate({ from: '/oldbuildings' });

  useEffect(() => {
    navigate({
      search: (prev: GetOldBuldingsDto) => ({
        ...prev,
        districts: districts && districts.length > 0 ? districts : undefined,
      }),
    });
  }, [districts, navigate]);

  const {
    data,
    currentData: buildings,
    isUninitialized,
    isSuccess,
    isLoading,
    isFetching,
  } = useOldBuldings({ limit, page, okrug, districts });

  // const [buildings] = useLazyOldBuildings({ limit, page, okrug, districts })

  // const onScroll = useCallback(() => {
  //   console.log(document.body.scrollTop);
  //   onBottomReached({
  //     callback: () => console.log('bottom'),
  //     containerRefElement: document.body,
  //     disabled: false,
  //     margin: 100,
  //   });
  // }, []);

  // useEffect(() => {
  //   window.addEventListener('scroll', onScroll);
  //   return window.removeEventListener('scroll', onScroll);
  // }, [onScroll]);

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  return (
    <VStack
      gap="s"
      align="start"
      className="relative  w-full overflow-auto  p-2"
    >
      {/* <OldBuildingsFilter /> */}
      <HStack>
        {/* <Link
          from="/oldbuildings"
          to="/oldbuildings"
          search={(prev: GetOldBuldingsDto) => ({ ...prev, page: 1 })}
        >
          1
        </Link>
        <Link
          from="/oldbuildings"
          to="/oldbuildings"
          search={(prev: GetOldBuldingsDto) => ({ ...prev, page: 2 })}
        >
          2
        </Link> */}
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
      {/* <Card className="w-full p-4"> */}

      {/* {isLoading && 'Loading...'}
      {isFetching && 'Fetching...'} */}
      <ScrollArea
        className="relative h-[calc(100vh-4rem)] w-full overflow-auto rounded-md border "
        ref={containerRef}
        onScroll={(e) => {
          console.log(containerRef?.current?.scrollTop);
          onBottomReached({
            callback: () => console.log('bottom'),
            containerRefElement: containerRef.current,
            disabled: false,
            margin: 100,
          });
        }}
      >
        <DataTable
          columns={oldBuildingsColumns}
          data={buildings || []}
          isFetching={isLoading || isFetching}
        />
      </ScrollArea>
      {/* </Card> */}
    </VStack>
  );
};

export { OldBuildingsPage };
