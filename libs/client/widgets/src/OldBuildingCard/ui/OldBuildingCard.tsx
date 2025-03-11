import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@urgp/client/shared';
import { OldBuilding, OldBuildingsPageSearch } from '@urgp/shared/entities';
import { Focus, Map, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { LatLngBounds, LatLngTuple, Map as LeafletMap } from 'leaflet';
import {
  OldBuildingTermsTable,
  useConnectedPlots,
  useOldBuildingConnections,
  useOldBuildingRelocationMap,
  useProblematicApartments,
} from '@urgp/client/entities';
import { ProblematicApartsTable } from './components/ProblematicApartsTable';
import { NewBuildingsTable } from './components/NewBuildingsTable';
import { OldApartmentDetailsSheet } from '../../OldApartmentDetailsSheet';
import { OldBuildingRelocationMap } from '../../OldBuildingRelocationMap';

type OldBuildingCardProps = {
  building: OldBuilding | null;
  className?: string;
  mode?: 'table' | 'map';
  onClose?: () => void;
  expanded?: boolean;
  setExpanded?: (value: boolean) => void;
  onCenter?: () => void;
};
const OldBuildingCard = ({
  building,
  className,
  onClose,
  mode = 'table',
  expanded = false,
  setExpanded,
  onCenter,
}: OldBuildingCardProps): JSX.Element | null => {
  const mapRef = useRef<LeafletMap>(null);
  const { data: mapItems } = useOldBuildingRelocationMap(building?.id || 0);
  const { tab, selectedBuildingId, apartment } = getRouteApi(
    mode === 'map'
      ? '/renovation/building-relocation-map'
      : '/renovation/oldbuildings',
  ).useSearch() as OldBuildingsPageSearch;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      const bounds = new LatLngBounds(
        mapItems?.[0]?.bounds?.coordinates?.[0] as LatLngTuple,
        mapItems?.[0]?.bounds?.coordinates?.[3] as LatLngTuple,
      );

      mapRef.current?.fitBounds(bounds, { padding: [10, 10] });
    }, 50);

    return () => {
      clearTimeout(timer1);
    };
  }, [selectedBuildingId, mapItems]);

  const navigate = useNavigate({ from: '/renovation/oldbuildings' });

  const {
    data: problematicAparts,
    isLoading: isLoadingProblematicAparts,
    isFetching: isFetchingProblematicAparts,
    refetch: refetchProblematicAparts,
  } = useProblematicApartments(building?.id || 0, { skip: !building?.id });

  const {
    data: connections,
    isLoading: isLoadingConnections,
    isFetching: isFetchingConnections,
  } = useOldBuildingConnections(building?.id || 0, {
    skip: !building?.id,
  });

  const { data: connectedPlots } = useConnectedPlots(building?.id || 0, {
    skip: !building?.id,
  });

  return (
    <Card
      className={cn(
        'relative z-20 flex flex-col',
        mode === 'map' && !expanded ? 'overflow-hidden' : '',
        className,
      )}
    >
      <CardHeader
        className={cn(
          'bg-accent/40 flex flex-row items-center gap-2 pb-1 transition-all ease-in-out',
          expanded ? '' : 'h-16 py-3',
          mode === 'map' ? 'cursor-pointer' : '',
        )}
        onClick={() => mode === 'map' && setExpanded && setExpanded(!expanded)}
      >
        {mode === 'map' && onCenter && (
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onCenter();
            }}
          >
            <Focus className="h-6 w-6" />
          </Button>
        )}
        <div className="flex flex-col">
          {building ? (
            <>
              <CardTitle>{building?.adress}</CardTitle>
              <CardDescription>
                {building?.okrug + ', район ' + building?.district}
              </CardDescription>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-6 w-full" />
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-3 pt-2">
        {building && (
          <>
            <Tabs
              defaultValue="terms"
              className="flex flex-1 flex-col"
              value={tab}
              onValueChange={(value) =>
                navigate({
                  search: (prev: OldBuildingsPageSearch) => ({
                    ...prev,
                    tab: value === 'terms' ? undefined : value,
                  }),
                })
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="terms">Сроки и квартиры</TabsTrigger>
                <TabsTrigger value="newBuildings">Площадки</TabsTrigger>
              </TabsList>
              <TabsContent value="terms" className="flex-1">
                <div className="flex h-full flex-col">
                  <OldBuildingTermsTable
                    terms={building.terms}
                    className="w-full"
                  />
                  {isFetchingProblematicAparts || isLoadingProblematicAparts ? (
                    <Skeleton className="mt-8 h-12 w-full" />
                  ) : (
                    <ProblematicApartsTable
                      problematicAparts={problematicAparts}
                      totalApartments={building.apartments.total}
                      buildingId={building.id}
                      selectedApartmentId={apartment}
                      className="w-full flex-1"
                      setSelectedAppartmentId={(value) => {
                        navigate({
                          search: (prev: OldBuildingsPageSearch) => ({
                            ...prev,
                            apartment: value,
                          }),
                        });
                      }}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="newBuildings" className="isolate flex-1">
                <div className="flex h-full flex-col gap-2">
                  {isLoadingConnections || isFetchingConnections ? (
                    <>
                      <Skeleton className="mt-8 h-12 w-full" />
                      <Skeleton className="mt-8 h-12 w-full" />
                    </>
                  ) : (
                    <>
                      <NewBuildingsTable
                        buildings={connections?.newBuildingMovements || null}
                        className={cn(
                          'w-full',
                          mode !== 'map' && 'max-h-[200px]',
                        )}
                        heading="Переселяется в"
                        emptyText="Не определены адреса переселения"
                        mode={mode}
                      />
                      <NewBuildingsTable
                        buildings={
                          connections?.newBuildingConstructions || null
                        }
                        className={cn(
                          'w-full',
                          mode !== 'map' && 'max-h-[200px]',
                        )}
                        heading="Строится на месте сноса"
                        emptyText="Нет площадок на месте сноса"
                        connectedPlots={connectedPlots}
                        oldBuildingId={building.id}
                        mode={mode}
                      />
                    </>
                  )}
                  {tab === 'newBuildings' && mode !== 'map' && (
                    <OldBuildingRelocationMap
                      ref={mapRef}
                      buildingId={building.id}
                      className="relative isolate w-[470px] flex-1 overflow-hidden rounded border"
                    >
                      <Button
                        variant="outline"
                        className="absolute right-2 top-2 z-[1000] h-10 w-10 p-0"
                        onClick={() =>
                          navigate({
                            to: '/renovation/building-relocation-map',
                            search: {
                              selectedBuildingId: building?.id || undefined,
                            },
                            from: '/renovation/oldbuildings',
                          })
                        }
                      >
                        <Map className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="outline"
                        className="absolute bottom-2 right-2 z-[1000] h-10 w-10 p-0"
                        onClick={() => {
                          const bounds = new LatLngBounds(
                            mapItems?.[0]?.bounds
                              ?.coordinates?.[0] as LatLngTuple,
                            mapItems?.[0]?.bounds
                              ?.coordinates?.[3] as LatLngTuple,
                          );

                          mapRef.current?.fitBounds(bounds, {
                            padding: [10, 10],
                          });
                        }}
                      >
                        <Focus className="h-6 w-6" />
                      </Button>
                    </OldBuildingRelocationMap>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {onClose && (
              <Button
                variant="link"
                className="group absolute right-2 top-2 rounded-full p-2"
                onClick={() => onClose()}
              >
                <X className="stroke-muted-foreground opacity-50 group-hover:opacity-100" />
              </Button>
            )}

            <OldApartmentDetailsSheet
              apartmentId={apartment}
              className="right-[calc(var(--renovation-sidebar-width)+0.5rem)]"
              refetch={refetchProblematicAparts}
              setApartmentId={() =>
                navigate({
                  search: (prev: OldBuildingsPageSearch) => ({
                    ...prev,
                    apartment: undefined,
                  }),
                })
              }
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OldBuildingCard;
