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

type OldBuildingTermsTableProps = {
  building: OldBuilding | null;
  className?: string;
  caption?: string;
};
const OldBuildingTermsTable = ({
  building,
  className,
  caption,
}: OldBuildingTermsTableProps): JSX.Element => {
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
              <TableHead compact className="w-[60px] text-right">
                Сроки:
              </TableHead>
              <TableHead compact className="w-[100px] text-center">
                Старт
              </TableHead>
              <TableHead compact className="w-[100px] text-center">
                Переселен
              </TableHead>
              <TableHead compact className="w-[100px] text-center">
                Отселен
              </TableHead>
              <TableHead compact className="w-[100px] text-center">
                Снесен
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="text-muted-foreground">
              <TableCell compact className="text-right text-xs">
                План:
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(building?.terms.plan.firstResetlementStart)}
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(building?.terms.plan.firstResetlementEnd)}
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(building?.terms.plan.secontResetlementEnd)}
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(building?.terms.plan.demolitionEnd)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell compact className="text-right text-xs">
                Факт:
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(building?.terms.actual.firstResetlementStart)}
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(building?.terms.actual.firstResetlementEnd)}
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(building?.terms.actual.secontResetlementEnd)}
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(building?.terms.actual.demolitionEnd)}
              </TableCell>
            </TableRow>
            {building?.terms && (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <OldBuildingTermsChart
                    terms={building.terms}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </VStack>
  );
};

export { OldBuildingTermsTable };
