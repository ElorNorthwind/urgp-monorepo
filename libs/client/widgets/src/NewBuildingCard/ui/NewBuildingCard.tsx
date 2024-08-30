import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { NewBuilding } from '@urgp/shared/entities';
import { Focus, X } from 'lucide-react';
import { NewBuildingTermsTable } from './components/NewBuildingTermsTable';

type NewBuildingCardProps = {
  building: NewBuilding | null;
  className?: string;
  mode?: 'table' | 'map';
  onClose?: () => void;
  width?: number;
  expanded?: boolean;
  setExpanded?: (value: boolean) => void;
  onCenter?: () => void;
};
const NewBuildingsCard = ({
  building,
  className,
  onClose,
  width = 520,
  mode = 'map',
  expanded = false,
  setExpanded,
  onCenter,
}: NewBuildingCardProps): JSX.Element | null => {
  return (
    <Card
      className={cn(
        'relative flex h-full flex-col overflow-hidden',
        expanded ? '' : '',
        className,
      )}
      style={{ width: building ? width : 0 }}
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
            className="h-10 w-10 flex-shrink-0 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onCenter();
            }}
          >
            <Focus className="h-6 w-6" />
          </Button>
        )}
        <div className="flex w-full flex-col pr-14">
          {building ? (
            <>
              <CardTitle className="truncate">{building?.adress}</CardTitle>
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
            <NewBuildingTermsTable terms={building.terms} />
            {onClose && (
              <Button
                variant="link"
                className="group absolute top-2 right-2 rounded-full p-2"
                onClick={() => onClose()}
              >
                <X className="stroke-muted-foreground opacity-50 group-hover:opacity-100" />
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export { NewBuildingsCard };
