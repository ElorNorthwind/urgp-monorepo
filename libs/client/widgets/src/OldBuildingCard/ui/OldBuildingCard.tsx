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
  useApartmentMessages,
  useConnectedPlots,
  useOldBuildingRelocationMap,
} from '@urgp/client/entities';
import { ProblematicApartsTable } from './components/ProblematicApartsTable';
import { NewBuildingsTable } from './components/NewBuildingsTable';
import { OldApartmentDetailsSheet } from '../../OldApartmentDetailsSheet';
import { OldBuildingRelocationMap } from '../../OldBuildingRelocationMap';

type OldBuildingCardProps = {
  building: OldBuilding | null;
  className?: string;
  onClose?: () => void;
  width?: number;
};
const OldBuildingsCard = ({
  building,
  className,
  onClose,
  width = 520,
}: OldBuildingCardProps): JSX.Element | null => {
  // const [showMFR, setShowMFR] = useState<boolean>(true);
  // const [appartmentDetails, setAppartmentDetails] = useState<number | null>(
  //   null,
  // );
  const mapRef = useRef<LeafletMap>(null);
  const { data: mapItems } = useOldBuildingRelocationMap(building?.id || 0);

  const { tab, selectedBuildingId, apartment } = getRouteApi(
    '/renovation/oldbuildings',
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

  const { data: messages, refetch: refetchAll } = useApartmentMessages({
    apartmentIds: [
      0,
      ...(building?.problematicAparts?.map((apart) => apart.id) || []),
    ],
  });

  const { data: connectedPlots } = useConnectedPlots(building?.id || 0, {
    skip: !building?.id,
  });

  return (
    <Card
      className={cn(
        'relative flex h-full flex-col',
        building ? '' : '',
        className,
      )}
      style={{ width: building ? width : 0 }}
    >
      <CardHeader className="bg-accent/40 flex flex-row items-center gap-2 pb-1">
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
                  <ProblematicApartsTable
                    problematicAparts={building.problematicAparts}
                    totalApartments={building.totalApartments}
                    buildingId={building.id}
                    messages={messages}
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
                </div>
              </TabsContent>
              <TabsContent value="newBuildings" className="isolate flex-1">
                <div className="flex h-full flex-col gap-2">
                  <NewBuildingsTable
                    buildings={building.newBuildingMovements}
                    className="max-h-[200px] w-full"
                    heading="Переселяется в"
                    emptyText="Не определены адреса переселения"
                  />
                  <NewBuildingsTable
                    buildings={building.newBuildingConstructions}
                    className="max-h-[200px] w-full"
                    heading="Строится на месте сноса"
                    emptyText="Нет площадок на месте сноса"
                    connectedPlots={connectedPlots}
                    oldBuildingId={building.id}
                  />
                  {tab === 'newBuildings' && (
                    <OldBuildingRelocationMap
                      ref={mapRef}
                      buildingId={building.id}
                      className="relative isolate w-[470px] flex-1 overflow-hidden rounded border"
                    >
                      <Button
                        variant="outline"
                        className="absolute top-2 right-2 z-[1000] h-10 w-10 p-0"
                        onClick={() =>
                          navigate({
                            to: '/renovation/building-relocation-map',
                            search: { buildingId: building?.id || undefined },
                            from: '/renovation/oldbuildings',
                          })
                        }
                      >
                        <Map className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="outline"
                        className="absolute right-2 bottom-2 z-[1000] h-10 w-10 p-0"
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
                className="group absolute top-2 right-2 rounded-full p-2"
                onClick={() => onClose()}
              >
                <X className="stroke-muted-foreground opacity-50 group-hover:opacity-100" />
              </Button>
            )}

            <OldApartmentDetailsSheet
              apartmentId={apartment}
              refetch={refetchAll}
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

export { OldBuildingsCard };
