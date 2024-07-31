import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
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
  return (
    <Card
      className={cn(
        'relative flex flex-col overflow-hidden',
        building ? '' : '',
        className,
      )}
      style={{ width: building ? width : 0 }}
    >
      <CardHeader className="bg-accent/40 pb-3">
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
            </TabsList>
            <TabsContent value="terms">
              <OldBuildingTermsTable
                building={building}
                className="w-full flex-shrink "
              />
            </TabsContent>
            <TabsContent value="newBuildings">
              <ScrollArea className="flex w-full flex-col gap-1">
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
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
          {building?.problematicAparts &&
            building?.problematicAparts?.length > 0 && (
              <h3>Проблемные квартиры</h3>
            )}
          <ProblematicApartsTable
            building={building}
            className="w-full flex-grow"
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
        </CardContent>
      )}
    </Card>
  );
};

export { OldBuildingsCard };
