import { useNavigate } from '@tanstack/react-router';
import {
  cn,
  formatDate,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  VStack,
} from '@urgp/client/shared';
import { NewBuilding, RelocationMapPageSerch } from '@urgp/shared/entities';

type NewBuildingConnectionsTableProps = {
  connections: NewBuilding['connections'] | null;
  className?: string;
  caption?: string;
};
const NewBuildingConnectionsTable = ({
  connections,
  className,
  caption,
}: NewBuildingConnectionsTableProps): JSX.Element => {
  const navigate = useNavigate({ from: '/renovation/building-relocation-map' });

  return (
    <VStack gap="s" className={cn('w-full', className)}>
      {caption && (
        <h3 className="text text-primary/40 m-0 w-full p-0 text-left">
          {caption}
        </h3>
      )}
      <div className="w-full overflow-clip rounded border">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-slate-50 text-center text-xs hover:bg-slate-50">
              <TableHead compact className="w-[220px] text-right">
                Адрес:
              </TableHead>
              <TableHead compact className="w-[30px] text-center">
                Старт
              </TableHead>
              <TableHead compact className="w-[30px] text-center">
                Снос
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections?.map((oldBuilding) => (
              <TableRow
                className="text-muted-foreground/30 cursor-pointer"
                key={oldBuilding.id}
                onClick={() =>
                  navigate({
                    search: (prev: RelocationMapPageSerch) => ({
                      ...prev,
                      selectedPlotId: undefined,
                      selectedBuildingId: oldBuilding.id,
                    }),
                  })
                }
              >
                <TableCell
                  compact
                  className="text-muted-foreground text-right text-xs"
                >
                  {oldBuilding?.adress}
                </TableCell>
                <TableCell
                  compact
                  className={cn(
                    oldBuilding?.terms.actual.start && 'text-muted-foreground',
                    'text-center text-xs',
                  )}
                >
                  {formatDate(
                    oldBuilding?.terms.actual.start ??
                      oldBuilding?.terms.plan.start,
                  )}
                </TableCell>
                <TableCell
                  compact
                  className={cn(
                    oldBuilding?.terms.actual.demolition &&
                      'text-muted-foreground',
                    'text-center text-xs',
                  )}
                >
                  {formatDate(
                    oldBuilding?.terms.actual.demolition ??
                      oldBuilding?.terms.plan.demolition,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </VStack>
  );
};

export { NewBuildingConnectionsTable };
