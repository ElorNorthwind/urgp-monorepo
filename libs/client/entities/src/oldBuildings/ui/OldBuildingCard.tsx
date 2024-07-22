import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  VStack,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { OldBuildingTermsTable } from './OldBuildingTermsTable';
import { ProblematicApartsTable } from '../ProblematicApartsTable';

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
      <CardHeader className="pb-0">
        <CardTitle>{building?.adress}</CardTitle>
        <CardDescription>
          {building?.okrug + ' ' + building?.district}
        </CardDescription>
      </CardHeader>
      {building && (
        <CardContent className="pt-0">
          <VStack>
            <OldBuildingTermsTable
              building={building}
              className="w-full"
              caption="Сроки отселения здания"
            />
            <ProblematicApartsTable
              building={building}
              className="w-full"
              caption="Проблемные квартиры"
            />
          </VStack>
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
