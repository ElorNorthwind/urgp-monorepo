import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VStack,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { useCallback } from 'react';

function TermsCell(
  props: CellContext<OldBuilding, string | null>,
): JSX.Element {
  const formatDate = useCallback((date: string | null) => {
    return date ? new Date(date).toLocaleDateString('ru-RU') : ' ';
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger>
        <VStack
          gap="none"
          align={'center'}
          justify={'center'}
          className="w-[80px]"
        >
          <div className="text-muted-foreground flex w-full place-content-center text-xs opacity-70">
            {formatDate(props.row.original.terms.plan.firstResetlementStart)}
          </div>
          <div className="flex w-full place-content-center text-xs">
            {formatDate(props.row.original.terms.actual.firstResetlementStart)}
          </div>
        </VStack>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="p-0">
          <TooltipArrow />
          <Table>
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
                <TableCell compact className="text-right text-xs font-bold">
                  План:
                </TableCell>
                <TableCell compact className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.plan.firstResetlementStart,
                  )}
                </TableCell>
                <TableCell compact className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.plan.firstResetlementEnd,
                  )}
                </TableCell>
                <TableCell compact className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.plan.secontResetlementEnd,
                  )}
                </TableCell>
                <TableCell compact className="text-center text-xs">
                  {formatDate(props.row.original.terms.plan.demolitionEnd)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell compact className="text-right text-xs font-bold">
                  Факт:
                </TableCell>
                <TableCell compact className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.actual.firstResetlementStart,
                  )}
                </TableCell>
                <TableCell compact className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.actual.firstResetlementEnd,
                  )}
                </TableCell>
                <TableCell compact className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.actual.secontResetlementEnd,
                  )}
                </TableCell>
                <TableCell compact className="text-center text-xs">
                  {formatDate(props.row.original.terms.actual.demolitionEnd)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { TermsCell };
