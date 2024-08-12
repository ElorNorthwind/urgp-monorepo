import {
  cn,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  VStack,
} from '@urgp/client/shared';
import { ConnectedPlots, OldBuilding } from '@urgp/shared/entities';
import { HousePlug } from 'lucide-react';
import dayjs from 'dayjs';
import { DeviationsCell } from './cells/DeviationsCell';

type NewBuildingsTableProps = {
  buildings: OldBuilding['newBuildingConstructions'] | null;
  className?: string;
  heading?: string;
  emptyText?: string;
  connectedPlots?: ConnectedPlots[];
  oldBuildingId?: number;
};
const NewBuildingsTable = ({
  buildings,
  className,
  heading = 'Адрес',
  emptyText = 'Нет адресов',
  connectedPlots,
  oldBuildingId = 0,
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
            const filteredPlots = connectedPlots
              ?.find((plot) => plot.newBuildingId === building.id)
              ?.plots.filter((plot) => plot.id !== oldBuildingId);

            return (
              <>
                <TableRow className="" key={building.id}>
                  <TableCell compact className="text-left text-xs">
                    <div>{building.adress}</div>
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
                {filteredPlots && filteredPlots.length > 0 && (
                  <TableRow className="bg-amber-50 p-0 text-xs  hover:bg-amber-50 ">
                    <TableCell colSpan={3} className="py-2">
                      <h2 className="mb-1 text-base font-thin">
                        Другие дома на участке:
                      </h2>
                      {filteredPlots.map((plot) => (
                        <>
                          <p className="-mb-1 mt-2 font-bold">{plot.adress}</p>
                          <DeviationsCell
                            className="py-0"
                            row={{
                              original: {
                                // @ts-expect-error not how it should be done lol
                                apartments: {
                                  deviation: plot.aparts,
                                  total:
                                    plot.aparts.attention +
                                    plot.aparts.done +
                                    plot.aparts.mfr +
                                    plot.aparts.none +
                                    plot.aparts.risk,
                                },
                                adress: plot.adress,
                              },
                            }}
                          />
                        </>
                      ))}
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export { NewBuildingsTable };
