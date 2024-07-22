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
import { TermsCell } from './cells/TermsCell';
import { CellContext } from '@tanstack/react-table';
import { OldBuildingTermsTable } from './OldBuildingTermsTable';

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
      className={cn('relative overflow-hidden transition-all', className)}
      style={{ width: building ? width : 0 }}
    >
      <CardHeader>
        <CardTitle>{building?.adress}</CardTitle>
        <CardDescription>
          {building?.okrug + ' ' + building?.district}
        </CardDescription>
      </CardHeader>
      {building && (
        <CardContent>
          <VStack>
            <OldBuildingTermsTable
              building={building}
              className="w-full p-0"
              caption="Сроки отселения здания"
            />

            <div className="w-full">
              {JSON.stringify(building.problematicAparts)}
            </div>
          </VStack>
        </CardContent>
      )}
    </Card>
  );
};

export { OldBuildingsCard };
