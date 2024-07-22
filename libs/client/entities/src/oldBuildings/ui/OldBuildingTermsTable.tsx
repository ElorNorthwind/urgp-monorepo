import {
  cn,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { useCallback } from 'react';

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
  const formatDate = useCallback((date: string | null | undefined) => {
    return date ? new Date(date).toLocaleDateString('ru-RU') : ' ';
  }, []);
  return (
    <Table className={cn(className)}>
      {caption && (
        <TableCaption className="text-primary text py-2 pl-1 text-left">
          {caption}
        </TableCaption>
      )}
      <TableHeader>
        <TableRow className="bg-slate-50 text-center text-xs">
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
      </TableBody>
    </Table>
  );
};

export { OldBuildingTermsTable };
