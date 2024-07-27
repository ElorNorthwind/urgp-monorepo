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
  VStack,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { OldBuildingTermsTable } from './OldBuildingTermsTable';
import { Separator } from '@radix-ui/react-separator';
import { ProblematicApartsTable } from './ProblematicApartsTable';
import { OldBuildingTermsChart } from './OldBuildingsTermsChart';

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
        'relative overflow-hidden transition-all',
        building ? '' : 'hidden',
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
        <CardContent className="flex h-[calc(100%-5.7rem)] flex-col gap-3 overflow-hidden pt-2">
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
              <Card>
                <CardHeader>
                  <CardTitle>TBD</CardTitle>
                </CardHeader>
              </Card>
              {/* <div>{JSON.stringify(building.newBuildingConstructions)}</div>
              <div>{JSON.stringify(building.newBuildingMovements)}</div> */}
            </TabsContent>
          </Tabs>
          <ProblematicApartsTable
            building={building}
            className="w-full flex-grow "
            caption="Проблемные квартиры"
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
