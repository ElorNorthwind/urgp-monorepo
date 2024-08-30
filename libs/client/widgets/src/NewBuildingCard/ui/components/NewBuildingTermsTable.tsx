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
import { NewBuilding } from '@urgp/shared/entities';

type NewBuildingTermsTableProps = {
  terms: NewBuilding['terms'] | null;
  className?: string;
  caption?: string;
};
const NewBuildingTermsTable = ({
  terms,
  className,
  caption,
}: NewBuildingTermsTableProps): JSX.Element => {
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
              <TableHead compact className="w-[150px] text-right">
                Сроки:
              </TableHead>
              <TableHead compact className="w-[70px] text-center">
                Ввод
              </TableHead>
              <TableHead compact className="w-[70px] text-center">
                Заселение
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="text-muted-foreground">
              <TableCell compact className="text-right text-xs">
                План:
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(terms?.plan.commissioning)}
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(terms?.plan.settlement)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell compact className="text-right text-xs">
                Факт:
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(terms?.actual.commissioning)}
              </TableCell>
              <TableCell compact className="text-center text-xs">
                {formatDate(terms?.actual.settlement)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </VStack>
  );
};

export { NewBuildingTermsTable };
