import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  HStack,
  Label,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@urgp/client/shared';
import { OldBuilding, OldBuildingsPageSearch } from '@urgp/shared/entities';
import { ExternalLink, Map, X } from 'lucide-react';
import { OldBuildingTermsTable } from './components/OldBuildingTermsTable';
import { ProblematicApartsTable } from './components/ProblematicApartsTable';
import { NewBuildingsTable } from './components/NewBuildingsTable';
import { useEffect, useRef, useState } from 'react';
import { OldApartmentDetailsSheet } from '../../oldApartments/ui/OldApartmentDetailsSheet';
import { useApartmentMessages } from '../../messages';
import { useConnectedPlots } from '../api/oldBuildingsApi';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { OldBuildingRelocationMap } from './OldBuildingRelocationMap';

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
  const [showMFR, setShowMFR] = useState<boolean>(true);
  const [appartmentDetails, setAppartmentDetails] = useState<number | null>(
    null,
  );

  const { tab, selectedBuildingId } = getRouteApi(
    '/renovation/oldbuildings',
  ).useSearch() as OldBuildingsPageSearch;

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
                    building={building}
                    className="w-full"
                  />
                  <HStack className="p-2">
                    {building?.problematicAparts &&
                      building?.problematicAparts?.length > 0 && (
                        <>
                          <h3>Проблемные квартиры</h3>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="show-mfr"
                              defaultChecked
                              checked={showMFR}
                              onCheckedChange={(e) => {
                                setShowMFR(e);
                              }}
                            />
                            <Label
                              htmlFor="show-mfr"
                              className={cn(
                                'transition-opacity',
                                !showMFR ? 'line-through opacity-30' : '',
                              )}
                            >
                              МФР
                            </Label>
                          </div>
                        </>
                      )}
                    {building.totalApartments > 0 && (
                      <Button
                        variant="ghost"
                        className="ml-auto space-x-2 px-2"
                        onClick={() =>
                          navigate({
                            to: '/renovation/oldapartments',
                            search: { buildingIds: [building.id] },
                          })
                        }
                      >
                        <p>Все кв.</p>
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    )}
                  </HStack>
                  <ProblematicApartsTable
                    building={building}
                    messages={messages}
                    className="w-full flex-1"
                    showMFR={showMFR}
                    setSelectedAppartmentId={setAppartmentDetails}
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
                      buildingId={building.id}
                      className="relative isolate w-[470px] flex-1 overflow-hidden rounded border"
                    >
                      <Button
                        variant="outline"
                        className="absolute top-2 right-2 z-[1000] h-12 w-12 p-0"
                        onClick={() =>
                          navigate({
                            to: '/renovation/building-relocation-map',
                            search: { buildingId: building?.id || undefined },
                            from: '/renovation/oldbuildings',
                          })
                        }
                      >
                        <Map className="z-[1000] h-6 w-6" />
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
              apartmentId={appartmentDetails}
              refetch={refetchAll}
              setApartmentId={setAppartmentDetails}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export { OldBuildingsCard };
