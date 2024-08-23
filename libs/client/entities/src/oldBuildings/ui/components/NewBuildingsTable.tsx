import {
  cn,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  VStack,
} from '@urgp/client/shared';
import {
  ConnectedPlots,
  OldBuilding,
  OldBuildingsPageSearch,
} from '@urgp/shared/entities';
import { HousePlug } from 'lucide-react';
import dayjs from 'dayjs';
import { DeviationChart } from './DeviationChart';
import { useNavigate } from '@tanstack/react-router';
import { Fragment } from 'react';

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
  const navigate = useNavigate({ from: '/renovation/oldbuildings' });

  if (!buildings)
    return (
      <VStack gap="none" className={cn('rounded border p-2', className)}>
        <HousePlug className="stroke-muted-foreground h-12 w-12 stroke-1" />
        <div className="text-muted-foreground">{emptyText}</div>
      </VStack>
    );

  return (
    <ScrollArea className={cn('rounded border', className)}>
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
            const filteredPlots = connectedPlots?.find(
              (plot) => plot.newBuildingId === building.id,
            )?.plots;

            // .filter((plot) => plot.id !== oldBuildingId);
            // filteredPlots &&
            //   filteredPlots?.sort((a, b) => (a.id === oldBuildingId ? 1 : -1));

            return (
              <Fragment key={building.id + 'fragment'}>
                <TableRow className="" key={building.id + 'row'}>
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
                  <TableRow
                    className=" hover:bg-background bg-background p-0 text-xs"
                    key={building.id + 'subrow'}
                  >
                    <TableCell
                      colSpan={3}
                      className="w-full gap-1 space-y-2 p-2"
                    >
                      <h2 className="border-muted-foreground/10 bg-muted-foreground/5 mb-1 rounded-t border-b py-1 text-center">
                        Сносимые дома на участке:
                      </h2>
                      {filteredPlots.map((plot) => (
                        <div
                          className={cn(
                            'group',
                            plot.id !== oldBuildingId ? 'cursor-pointer' : '',
                          )}
                          key={plot.id}
                          onClick={() =>
                            plot.id !== oldBuildingId &&
                            navigate({
                              to: `/renovation/oldbuildings`,
                              search: (prev: OldBuildingsPageSearch) => ({
                                ...prev,
                                selectedBuildingId: plot.id,
                              }),
                            })
                          }
                        >
                          <p
                            className={cn(
                              'text-center font-bold leading-none',
                              plot.id === oldBuildingId
                                ? 'text-primary before:mr-1 before:content-["››"] after:ml-1 after:content-["‹‹"]'
                                : 'text-muted-foreground decoration-slate-300 group-hover:underline',
                            )}
                          >
                            {plot.adress}
                          </p>
                          <DeviationChart
                            className="h-6 w-full"
                            chartClassName="h-5"
                            building={{
                              adress: plot.adress,
                              total:
                                plot.aparts.attention +
                                plot.aparts.done +
                                plot.aparts.mfr +
                                plot.aparts.none +
                                plot.aparts.risk,
                              apartments: plot.aparts,
                            }}
                          />
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export { NewBuildingsTable };
