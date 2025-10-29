import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VStack,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { format, toDate } from 'date-fns';

function AdressCell(props: CellContext<OldBuilding, string>): JSX.Element {
  const isLate = props?.row?.original?.terms?.bossControl
    ? toDate(props?.row?.original?.terms?.bossControl) <=
      toDate(new Date().setHours(0, 0, 0, 0))
    : false;

  return (
    <div className="flex w-full flex-row gap-2">
      {/* {StatusIcon && (
        <StatusIcon className={cn('size-8 flex-shrink-0', iconStyle)} />
      )} */}
      <div className="flex flex-1 flex-col items-start justify-start truncate">
        <div className="truncate">
          <span className="">{props?.row?.original?.adress}</span>
        </div>
        {props.row.original.terms?.bossControl && (
          <div className="text-muted-foreground w-full truncate text-xs">
            <span className={cn('w-full truncate', isLate && 'text-red-500')}>
              {'контроль: ' +
                format(props.row.original.terms?.bossControl, 'dd.MM.yyyy')}
            </span>
          </div>
        )}
      </div>
    </div>

    // <Tooltip>
    //   <TooltipTrigger>
    //     <VStack
    //       gap={'none'}
    //       justify={'center'}
    //       align={'start'}
    //       className="w-[140px] text-left"
    //     >
    //       <div className="w-full truncate ">{props.row.original.okrug}</div>
    //       <div className="text-muted-foreground w-full truncate text-sm">
    //         {props.row.original.district}
    //       </div>
    //     </VStack>
    //   </TooltipTrigger>
    //   <TooltipPortal>
    //     <TooltipContent>
    //       <TooltipArrow />
    //       <p>
    //         <b>Округ:</b> {props.row.original.okrug}
    //       </p>
    //       <p>
    //         <b>Район:</b> {props.row.original.district}
    //       </p>
    //     </TooltipContent>
    //   </TooltipPortal>
    // </Tooltip>
  );
}

export { AdressCell };
