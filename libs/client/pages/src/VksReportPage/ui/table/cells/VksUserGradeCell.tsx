import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { VksUserStats } from '@urgp/shared/entities';

import { Star } from 'lucide-react';

function VksUserGradeCell(
  props: CellContext<VksUserStats, number>,
): JSX.Element {
  if (!props.getValue())
    return (
      <div
        className={cn(
          'text-muted-foreground flex w-full flex-col truncate font-thin',
        )}
      >
        Оценок не оставлено
      </div>
    );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex flex-1 flex-shrink flex-col items-start justify-start truncate',
          )}
        >
          <>
            <div
              className={cn(
                'flex flex-row items-center justify-start gap-1 truncate',
              )}
            >
              <span className="mr-1 text-lg">{props.getValue() || '0.00'}</span>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={'star_' + i}
                  className={cn(
                    'size-5 flex-shrink-0',
                    i > (props.getValue() || 0) - 1
                      ? 'text-gray-300'
                      : 'fill-amber-500 text-amber-500',
                  )}
                />
              ))}
            </div>
          </>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[600px] flex-col gap-0">
            <div className="font-bold">Полученные оценки:</div>
            {[1, 2, 3, 4, 5].map((i) => {
              const value = props?.row?.original?.[
                `g${i}` as keyof VksUserStats
              ] as number;
              return (
                <div
                  key={i + 'star_value'}
                  className={cn(
                    'flex items-center justify-end gap-0',
                    value === 0 && 'opacity-30',
                  )}
                >
                  <span className="mr-auto pr-2 font-semibold">
                    {value || '-'}
                  </span>
                  {[...Array(i)].map((i, ind) => (
                    <Star
                      key={'star_' + i + '_' + ind}
                      className={cn(
                        'size-3 flex-shrink-0',
                        'fill-amber-500 text-amber-500',
                      )}
                    />
                  ))}

                  <span className="text-muted-foreground ml-2 font-normal">
                    {i} звезда
                  </span>
                </div>
              );
            })}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { VksUserGradeCell };
