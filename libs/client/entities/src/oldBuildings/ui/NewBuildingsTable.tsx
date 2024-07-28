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
import { OldBuilding } from '@urgp/shared/entities';
import { OldBuildingTermsChart } from './OldBuildingsTermsChart';
import { HousePlug } from 'lucide-react';
import dayjs from 'dayjs';

type NewBuildingsTableProps = {
  buildings: OldBuilding['newBuildingConstructions'] | null;
  className?: string;
  heading?: string;
  emptyText?: string;
};
const NewBuildingsTable = ({
  buildings,
  className,
  heading = 'Адрес',
  emptyText = 'Нет адресов',
}: NewBuildingsTableProps): JSX.Element => {
  if (!buildings)
    return (
      <VStack gap="none" className={cn('rounded border p-2', className)}>
        <HousePlug className="stroke-muted-foreground h-12 w-12 stroke-1" />
        <div className="text-muted-foreground">{emptyText}</div>
      </VStack>
    );

  return (
    <div className={cn('overflow-auto rounded border', className)}>
      <Table className="w-full">
        <TableHeader>
          <TableRow className="sticky top-0 z-10 bg-slate-50 text-center text-xs hover:bg-slate-50">
            <TableHead compact className="min-w-[200px] text-left font-bold">
              {heading}
            </TableHead>
            <TableHead compact className="min-w-[60px] text-center">
              Ввод
            </TableHead>
            <TableHead compact className="min-w-[60px] text-center">
              Заселение
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildings.map((building) => {
            return (
              <TableRow className="" key={building.id}>
                <TableCell compact className="text-left text-xs">
                  {building.adress}
                </TableCell>
                <TableCell compact className="w-[60px] text-center text-xs">
                  {building.terms.actual.commissioning
                    ? dayjs(building.terms.actual.commissioning).format(
                        'DD.MM.YYYY',
                      )
                    : ' '}
                </TableCell>
                <TableCell compact className="w-[60px] text-center text-xs">
                  {building.terms.actual.settlement
                    ? dayjs(building.terms.actual.settlement).format(
                        'DD.MM.YYYY',
                      )
                    : ' '}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export { NewBuildingsTable };
