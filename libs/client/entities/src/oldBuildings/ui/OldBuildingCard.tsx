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
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { OldBuildingTermsTable } from './OldBuildingTermsTable';
import { ProblematicApartsTable } from './ProblematicApartsTable';
import { NewBuildingsTable } from './NewBuildingsTable';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useState } from 'react';
import { OldApartmentDetailsSheet } from '../../oldApartments/ui/OldApartmentDetailsSheet';
import { useApartmentMessages } from '../../messages';
import { useConnectedPlots } from '../api/oldBuildingsApi';
import { DeviationsCell } from './cells/DeviationsCell';

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
}: OldBuildingCardProps): JSX.Element => {
  const [showMFR, setShowMFR] = useState<boolean>(true);
  const [appartmentDetails, setAppartmentDetails] = useState<number | null>(
    null,
  );

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
        'relative flex flex-col overflow-hidden',
        building ? '' : '',
        className,
      )}
      style={{ width: building ? width : 0 }}
    >
      <CardHeader className="bg-accent/40 pb-1">
        <CardTitle>{building?.adress}</CardTitle>
        <CardDescription>
          {building?.okrug + ', район ' + building?.district}
        </CardDescription>
      </CardHeader>
      {building && (
        <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden pt-2">
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="terms">Сроки отселения</TabsTrigger>
              <TabsTrigger value="newBuildings">Площадки</TabsTrigger>
              {/* <TabsTrigger value="comments">Примечания</TabsTrigger> */}
            </TabsList>
            <TabsContent value="terms">
              <OldBuildingTermsTable
                building={building}
                className="w-full flex-shrink "
              />
            </TabsContent>
            <TabsContent value="newBuildings">
              <ScrollArea className="flex w-full flex-col gap-1">
                <div className="rounded border px-4 py-0">
                  {/* <h2 className="text-center">Прогресс по дому:</h2> */}
                  <DeviationsCell
                    // @ts-expect-error to refactor
                    row={{
                      original: building,
                    }}
                  />
                </div>
                <NewBuildingsTable
                  buildings={building.newBuildingMovements}
                  className="max-h-[200px] w-full"
                  heading="Переселяется в"
                  emptyText="Не определены адреса переселения"
                />
                <NewBuildingsTable
                  buildings={building.newBuildingConstructions}
                  className="max-h-[300px] w-full"
                  heading="Строится на месте сноса"
                  emptyText="Нет площадок на месте сноса"
                  connectedPlots={connectedPlots}
                  oldBuildingId={building.id}
                />
              </ScrollArea>
            </TabsContent>
            {/* <TabsContent value="comments">
              <ScrollArea className="flex w-full flex-col gap-1">
                <div className="h-96">Tututu</div>
              </ScrollArea>
            </TabsContent> */}
          </Tabs>
          {building?.problematicAparts &&
            building?.problematicAparts?.length > 0 && (
              <HStack>
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
              </HStack>
            )}
          <ProblematicApartsTable
            building={building}
            messages={messages}
            className="w-full flex-grow"
            showMFR={showMFR}
            setSelectedAppartmentId={setAppartmentDetails}
          />
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
        </CardContent>
      )}
    </Card>
  );
};

export { OldBuildingsCard };
