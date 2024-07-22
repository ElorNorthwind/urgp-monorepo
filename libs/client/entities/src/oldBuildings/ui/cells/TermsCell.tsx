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
          <div className="text-muted-foreground w-full text-xs opacity-70">
            {formatDate(props.row.original.terms.plan.firstResetlementStart)}
          </div>
          <div className="w-full text-xs">
            {formatDate(props.row.original.terms.actual.firstResetlementStart)}
          </div>
        </VStack>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="pb-4">
          <TooltipArrow />
          <Table>
            <TableHeader>
              <TableRow className="text-center text-xs">
                <TableHead className="w-[60px] text-right">Сроки:</TableHead>
                <TableHead className="w-[100px] text-center">Старт</TableHead>
                <TableHead className="w-[100px] text-center">
                  Переселен
                </TableHead>
                <TableHead className="w-[100px] text-center">Отселен</TableHead>
                <TableHead className="w-[100px] text-center">Снесен</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="text-muted-foreground">
                <TableCell className="text-right font-bold">План:</TableCell>
                <TableCell className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.plan.firstResetlementStart,
                  )}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.plan.firstResetlementEnd,
                  )}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.plan.secontResetlementEnd,
                  )}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {formatDate(props.row.original.terms.plan.demolitionEnd)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-right font-bold">Факт:</TableCell>
                <TableCell className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.actual.firstResetlementStart,
                  )}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.actual.firstResetlementEnd,
                  )}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {formatDate(
                    props.row.original.terms.actual.secontResetlementEnd,
                  )}
                </TableCell>
                <TableCell className="text-center text-xs">
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
